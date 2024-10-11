const Task = require("../models/task.model")

//[get] /api/v1/tasks
module.exports.index = async (req, res) => {

  const find = {
    deleted: false
  }

  if (req.query.status){//- neu co status
    find.status = req.query.status
  }
  const tasks = await Task.find(find)
  // console.log(tasks)
  res.json(tasks)
}

//[get] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
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
}