const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({msg:'Logout Succesfully'});
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send({status:httpStatus.OK,msg:'Forgot Password has been generated Sucessfully'});
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({status:httpStatus.OK,msg:'Reset Password has been updated Sucessfully'});
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send({status:httpStatus.OK,msg:'Email Verification has been sent Sucessfully'});
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send({status:httpStatus.OK,msg:'Email has been verified Sucessfully'});
});

const getLoginUser = catchAsync(async(req,res)=>{
  const token =  getBearerToken(req);
  const user =   await authService.getLoginUser(req.body.email,token);
  res.status(httpStatus.OK).send({user});
});

const getBearerToken = (req)=>{
    const bearerHeader =  req.headers['authorization'];
    if(typeof bearerHeader !=='undefined'){
      const bearer =  bearerHeader.split(' ');
      const bearerToken =  bearer[1];
      return bearerToken;
    }
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getLoginUser
};
