const validateEmail = require("../helper-fns/validateEmail/validateEmail")

module.exports = function(req, rest, next) {
  const email = req.body.email_address

  if (!email) {
    next(new Error("Email was not sent. Try to use x-www-form-urlencoded."))
    return
  }

  if (!validateEmail(email)) {
    next(new Error("Email is not a valid one."))
    return
  }

  req.body.email_address.trim().toLowerCase()
  next()
}
