const Task = require("../models/task.model")
const paginationHelper = require("../../../helpers/pagination")
const searchHelper = require("../../../helpers/search")

//[get] /api/v1/tasks
module.exports.index = async (req, res) => {

  const find = {
    deleted: false
  }

  if (req.query.status) {//- neu co status
    find.status = req.query.status
  }

  //-tim kiem
  const objSearch = searchHelper(req.query)
  if (objSearch.regex) {
    find.title = objSearch.regex
  }
  //-end tim kiem


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
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
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

// [patch] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    //-lay ra id can update
    const id = req.params.id

    //- thứ muốn cập nhật(nội dung cập nhật cho status mà front-end y/c)
    const status = req.body.status

    //-update
    await Task.updateOne({
      _id: id,
    }, {
      status: status
    })

    res.json({
      code: 200, // cap nhat thanh cong
      message: "Cập nhật trạng thái thành công"
    })
  } catch (error) {
    res.json({
      code: 400, // cap nhat thanh cong
      message: "Không tồn tại"
    })
  }

}

// [patch] /api/v1/tasks/change-status/:id
module.exports.changeMulti = async (req, res) => {
  try {
    //-lay ra cac id, key, value can thay doi
    const { ids, key, value } = req.body

    switch (key) { //- dang test vs Postman vs key la status
      case "status":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        })
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công"
        })
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại"
        })
        break;
    }


  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    })
  }
}