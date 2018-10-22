const firstUppercase = require("../helper-fns/firstUppercase/firstUppercase")

module.exports = function(req, rest, next) {
  const name = req.body.name

  if (!name) {
    next(new Error("Name was not sent. Try to use x-www-form-urlencoded."))
    return
  }

  req.body.name = firstUppercase(req.body.name)

  next()
}
