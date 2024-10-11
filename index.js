const express = require('express')
//- dotenv
require("dotenv").config()
//- end dotenv

//- nhung route
const routesApiVer1 = require("./api/v1/routes/index.route")

const app = express()
const port = process.env.PORT

//- database
const database = require("./config/database")
database.connect()
//- end database

//-goi route Ver1
routesApiVer1(app)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})