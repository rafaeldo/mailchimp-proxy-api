const whitelist = [process.env.WHITELIST_URL1, process.env.WHITELIST_URL2]

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}

module.exports = corsOptions
