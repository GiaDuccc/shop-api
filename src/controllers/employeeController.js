import { StatusCodes } from 'http-status-codes'
import { employeeModel } from '~/models/employeeModel'
import { employeeService } from '~/services/employeeService'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const employee = await employeeService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(employee)
  } catch (error) {
    next(error)
  }
}

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeModel.getAllEmployees()
    res.status(StatusCodes.OK).json(employees)
  } catch (error) {
    next(error)
  }
}

const getAllEmployeePage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12

    // eslint-disable-next-line no-unused-vars
    let { page: _p, limit: _l, ...filters } = req.query

    const employees = await employeeModel.getAllEmployeesPage(page, limit, filters)
    res.status(StatusCodes.OK).json(employees)
  } catch (error) {
    next(error)
  }
}

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeModel.findOneById(req.params.id)
    res.status(StatusCodes.OK).json(employee)
  } catch (error) {
    next(error)
  }
}

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await employeeModel.deleteOneById(req.params.id)
    if (!employee) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Employee not found')
    }
    res.status(StatusCodes.OK).json({
      message: 'Employee deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const updateEmployeeRole = async (req, res, next) => {
  try {
    const { role } = req.body
    await employeeModel.updateEmployeeRole(req.params.id, role)
    res.status(StatusCodes.OK).json({ message: 'Employee role updated successfully' })
  } catch (error) {
    next(error)
  }
}

export const employeeController = {
  getAllEmployees,
  createNew,
  getEmployeeById,
  deleteEmployee,
  getAllEmployeePage,
  updateEmployeeRole
}