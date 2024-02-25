const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const data = Object.assign({'status':httpStatus.Created,'data':user});
  res.status(httpStatus.CREATED).send(data);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  const data = Object.assign({'status':httpStatus.OK,'data':result});
  res.send(data);

});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const data = Object.assign({'status':httpStatus.OK,'data':user});
  res.send(data);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  const data = Object.assign({'status':httpStatus.OK,'msg':'Data has been update successfully','data':user});
  res.send(data);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  const data = Object.assign({'status':httpStatus.OK,'msg':'Data has been delete successfully'});
  res.status(httpStatus.OK).send(data);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
