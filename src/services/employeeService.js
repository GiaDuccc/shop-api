import { employeeModel } from '~/models/employeeModel'

const createNew = async (employeeData) => {
  const newEmployee = await employeeModel.createNew(employeeData)
  const result = await employeeModel.findOneById(newEmployee.insertedId)
  return result
}

export const employeeService = {
  createNew
}