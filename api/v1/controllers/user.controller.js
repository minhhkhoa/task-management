const Task = require("../models/task.model")
const User = require("../models/user.model")
const ForgotPassword = require("../models/forgot-password.model")

const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendMail")


//-ma hoa mk
const md5 = require("md5")

//[post] /api/v1/users/register
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

//[post] /api/v1/users/login
module.exports.login = async (req, res) => {

  //- Sau nay nho them validate

  //- lay thong tin tu body
  const { email, password } = req.body

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  //-check email
  if (!user) {//-neu ch co
    res.json({
      code: 400,
      message: "Email không tồn tại"
    })
    return
  }

  //-check password
  if (md5(password) != user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu"
    })
    return
  }

  //-chay toi day thi ok roi
  const token = user.token
  res.cookie("token", token)

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: token
  })
}

//[post] /api/v1/password/forgot
module.exports.forgotPassword = async (req, res) => {
  //B1: Nhap email can doi
  //-lay ra email gui len can dat lai mk
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if(!user){//-neu ko co
    res.json({
      code: 200,
      message: "Email không tồn tại"
    })
    return
  }

  //- tao ma otp
  const otp = generateHelper.generateRandomNumber(8)

  //- luu thong tin dua can doi mk vao db, can tao them model
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  }
  //- save to model
  const data = new ForgotPassword(objectForgotPassword)
  await data.save()

  //B2: Gui otp qua emai user
  const subject = "Mã OTP xác minh lại mật khẩu"
  const html = `
    Mã OTP lấy lại mật khẩu của bạn là <b>${otp}</b>(Sử dụng trong 180s).
    Vui lòng không chia sẻ mã OTP này cho bất kỳ ai
  `
  sendMailHelper.sendMail(email, subject, html)

  res.json({
    code: 200,
    mesage: "Đã gửi mã OTP qua email"
  })
}

//[post] /api/v1/password/otp
module.exports.otpPassword = async (req, res) => {
  //B3: ng dung nhap ma otp

  //-lay otp ng dung nhap
  const {email, otp} = req.body

  //- vi minh de model nay la sau 3p la tu xoa nen phai lam nhu nay
  //- tuc la trc 3p phai tim xem co result khong, sau 3p thi user can lay lai pass da bi xoa khoi model
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  //-check
  if(!result){//- neu ko co
    res.json({
      code: 400,
      message: "OTP không hợp lệ"
    })
    return
  }

  //- chay toi day la nhap dung otp roi

  //-lay ra user can doi pass
  const user = await User.findOne({
    email: email
  })

  //- muc dich la cho login vao nhung van redirect sang trang reset pass
  const token = user.token
  res.cookie("token", token)

  res.json({
    code: 200,
    message: "Xác thực thành công",
    token: token
  })
}

//[post] /api/v1/password/reset
module.exports.resetPassword = async (req, res) => {
  //B4: doi pass
  //- lay lai data gui tu client
  const {token, password} = req.body

  //- lay ra user can doi pass
  const user = await User.findOne({
    token: token
  })

  if(md5(password) === user.password){
    res.json({
      code: 400,
      message: "Vui long nhập mật khẩu mới khác mật khẩu cũ"
    })
    return
  }

  //- update new pass
  await User.updateOne({
    token: token
  },{
    password: md5(password)
  })

  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công"
  })
}
