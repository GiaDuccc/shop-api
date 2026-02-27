import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'

const EMPLOYEE_COLLECTION_NAME = 'employees'
const EMPLOYEE_COLLECTION_SCHEMA = Joi.object({
  firstName: Joi.string().required().max(256).trim(),
  lastName: Joi.string().required().max(256).trim(),
  dob: Joi.date().less('now').greater('1-1-1900').required(),
  email: Joi.string().email({ tlds: { allow: true } }).trim().lowercase(),
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
  password: Joi.string().min(6).max(256).default('Admin123'),
  address: Joi.string().max(512).required().trim(),
  role: Joi.string().valid('manager', 'admin', 'staff').required(),
  salary: Joi.number().min(0).required(),
  createdAt: Joi.date().timestamp('javascript').default(new Date),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) => {
  return await EMPLOYEE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validatedData = await validateBeforeCreate(data)
  validatedData.password = await bcrypt.hash(validatedData.password, 10)

  const existedEmail = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOne({ email: validatedData.email })

  if (existedEmail) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email is already in use')
  }

  const existedPhone = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOne({ phone: validatedData.phone })
  if (existedPhone) {
    throw new ApiError(StatusCodes.CONFLICT, 'Phone is already in use')
  }

  const result = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).insertOne(validatedData)
  return result
}

const getAllEmployees = () => {
  return GET_DB().collection(EMPLOYEE_COLLECTION_NAME).find({}).toArray()
}

const getAllEmployeesPage = async (page, limit, filters) => {
  const skip = (page - 1) * limit
  const { sort, search } = filters

  let sortOption = {}

  switch (sort) {
  case 'newest':
    sortOption = { createdAt: -1 }
    break
  case 'oldest':
    sortOption = { createdAt: 1 }
    break
  case 'A-Z':
    sortOption = { lastName: 1 }
    break
  case 'Z-A':
    sortOption = { lastName: -1 }
    break
  default:
    sortOption = {}
  }

  const matchConditions = {}

  if (search) {
    const orConditions = []

    orConditions.push(
      { address: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    )

    matchConditions.$or = orConditions
  }

  const allFilter = [
    { $match: matchConditions },
    ...(Object.keys(sortOption).length > 0 ? [{ $sort: sortOption }] : []),
    { $skip: skip },
    { $limit: limit }
  ]

  const allEmployees = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).aggregate(allFilter).toArray()
  const total = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).countDocuments({
    _destroy: false
  })

  const result = {
    employees: allEmployees,
    total: total
  }

  return result
}

const findOneById = async (id) => {
  return await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOne({
    _id: new ObjectId(id)
  })
}

const signIn = async (username, password) => {
  const employee = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOne({
    $or: [
      { email: username },
      { phone: username }
    ]
  })

  if (!employee || !(await bcrypt.compare(password, employee.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Email or Password.')
  }
  return employee
}

const updateRefreshToken = async (employeeId, refreshToken) => {
  await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(employeeId) },
    {
      $set: {
        refreshToken: refreshToken,
        updatedAt: new Date()
      }
    }
  )
}

const deleteOneById = async (id) => {
  return await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).deleteOne({
    _id: new ObjectId(id)
  })
}

const updateEmployeeRole = async (id, role) => {
  const result = await GET_DB().collection(EMPLOYEE_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        role: role,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  )
  return result.value
}

export const employeeModel = {
  createNew,
  getAllEmployees,
  findOneById,
  signIn,
  updateRefreshToken,
  deleteOneById,
  getAllEmployeesPage,
  updateEmployeeRole
}