const Task = require("../models/task.model")
const paginationHelper = require("../../../helpers/pagination")

//[get] /api/v1/tasks
module.exports.index = async (req, res) => {

  const find = {
    deleted: false
  }

  if (req.query.status){//- neu co status
    find.status = req.query.status
  }

  //start Phan trang
  const countTask = await Task.countDocuments(find)

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countTask
  )
  //end phan trang

  //-sort
  const sort ={}
  if (req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue
  }
  //-end sort
  
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objPagination.limitItems)
    .skip(objPagination.skip)

    
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