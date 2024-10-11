const Task = require("../models/task.model")
const User = require("../models/user.model")

//-ma hoa mk
const md5 = require("md5")

//[get] /api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password)

  //-check email
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  })

  if (existEmail) {//- neus cos
    res.json({
      code: 400,
      message: "Email đã tồn tại"
    })
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password
    })

    user.save() //-sau khi save song thi tra cho cai token

    const token = user.token
    res.cookie("token", token)


    res.json({
      code: 200,
      message: "Tạo tài khoản thành công",
      token: token
    })
  }

}