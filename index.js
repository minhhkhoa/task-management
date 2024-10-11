const express = require('express')
const Task = require("./models/task.model")
//- dotenv
require("dotenv").config()
//- end dotenv
//- database
const database = require("./config/database")
database.connect()
//- end database

const app = express()
const port = process.env.PORT

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  })
  // console.log(tasks)
  res.json(tasks)
})

app.get('/tasks/detail/:id', async (req, res) => {
  try {
    const id = req.params.id
    const tasks = await Task.findOne({
      _id: id,
      deleted: false
    })
    // console.log(tasks)
    res.json(tasks)
  } catch (error) {
    res.json("Không tìm thấy")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})