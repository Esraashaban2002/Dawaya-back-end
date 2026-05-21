exports.successResponse = (
  res,
  status = 200,
  message ,
  data = null
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (
  res,
  status = 500,
  message 
) => {
  return res.status(status).json({
    success: false,
    message ,
  });
};