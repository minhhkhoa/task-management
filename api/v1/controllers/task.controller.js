const Task = require("../models/task.model")
const paginationHelper = require("../../../helpers/pagination")
const searchHelper = require("../../../helpers/search")

//[get] /api/v1/tasks
module.exports.index = async (req, res) => {

  const find = {
    deleted: false,
    //- theo tao ra boi ai//-ai tham gia cung nua
    $or: [
      //-tao boi ai
      { createdBy: req.user.id },
      //- tk dang login co nam trong listUser tham gia ko
      { listUser: req.user.id }
    ]
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
    console.log(tasks)
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
    //-lay ra cac ids[] va key, value can thay doi
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

      case "delete":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: new Date() //-them key nay vao documen 
        })

        res.json({
          code: 200,
          message: "Xoá thành công"
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

// [post] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    //- lay ra user de biet dc dua nao create task (co th boi vi da di qua middleware nen ta biet thua dua nao create)
    req.body.createdBy = req.user.id //- biet dc dua nao tao qua id cua chinh no
    const task = new Task(req.body) //- task se nhan dc data tu front-end gui len
    const data = await task.save() //- khi luu dc thi gan tk do vao bien data

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
      data: data //- tra ra doi tg vua dc luu
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    })
  }
}

// [patch] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    //-lay ra id
    const id = req.params.id

    await Task.updateOne({
      _id: id
    }, req.body) //nhan dc nd can update tu front-end

    res.json({
      code: 200,
      message: "Cập nhật thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}

// [delete] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    //-lay ra id
    const id = req.params.id

    await Task.updateOne({
      _id: id
    }, { //- xoa mem
      deleted: true,
      deletedAt: new Date()
    })

    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}
