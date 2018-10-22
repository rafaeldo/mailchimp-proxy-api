const app = require("express")()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const md5 = require("md5")
const cors = require("cors")
const fetch = require("node-fetch")
require("dotenv").config()

// CORS
const corsOptions = require("./corsOptions")
app.use(cors(corsOptions))

// MIDDLEWARE
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CUSTOM MIDDLEWARE
const validateEmail = require("./middleware/validateEmail")
const formatName = require("./middleware/formatName")

// Mailchimp Base Options
const urlBase = process.env.URL_BASE
const listId = process.env.LIST_ID
const apiKey = process.env.BASIC_AUTH_API

// ROUTES
// - Post a New Subscriber
app.post("/subscribers", validateEmail, formatName, function(req, res, next) {
  let body = {
    email_address: req.body.email_address,
    status: "subscribed",
    merge_fields: {
      FNAME: req.body.name
    }
  }

  // Call the Mailchimp API
  fetch(urlBase + listId + "/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey
    },
    body: JSON.stringify(body)
  })
    .then(data => data.json())
    .then(json => res.json(json))
})

// - Unsubscribe Member from the list
app.patch("/subscribers", validateEmail, function(req, res) {
  // 1. Mailchimp API requests to hash the Email with MD5
  const md5Email = md5(req.body.email_address)

  // 2. Unsubscribe
  fetch(urlBase + listId + "/members/" + md5Email, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey
    },
    body: JSON.stringify({
      status: "unsubscribed"
    })
  })
    .then(data => data.json())
    .then(json => res.json(json))
})

// MIDDLEWARE - 'NOT FOUND'
app.use(function(req, res, next) {
  res.status(404)
  res.json({ message: "Route does not exist." })
})

// MIDDLEWARE - ERROR HANDLER
app.use(function(error, req, res, next) {
  res.status(500).json({ message: error.message })
})

// // // // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // // //
const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`Server online. Running at port ${port}`)
})
