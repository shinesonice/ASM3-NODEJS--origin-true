module.exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  console.log("Not isAdmin");
  res.send([]);
  return;
};
module.exports.isAuth = (req, res, next) => {
  if (req.session.isLogin) return next();
  console.log("Not user");
  res.send([]);
  return;
};
module.exports.isCounselor = (req, res, next) => {
  if (req.session.isCounselor || req.session.isAdmin) return next();
  console.log("Not isCounselor");
  res.send([]);
  return;
};
