//if not clear go over the error handling videos

//is the wrapper fn

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};
