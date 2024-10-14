const User = require("../models/user.model")


module.exports.requireAuth = async (req, res, next) => {
  //- ktra xem headers cuaf front-end co token hay k
  //- sau nay muon lay API thi fe phai gui kem token len theo de lay API
  if (req.headers.authorization) {
    // console.log(req.headers) //-->authorization: 'Bearer 4X8HSXS6XtuKgGzvUCNOCFgDBLyOS9'
    const token = req.headers.authorization.split(" ")[1] //- 4X8HSXS6XtuKgGzvUCNOCFgDBLyOS9
    // console.log(token)

    //- check xem co user nao co token nhu the k
    const user = await User.findOne({
      token: token,
      deleted: false
    }).select("-password")

    if (!user) { //- ko ton tai
      res.json({
        code: 400,
        message: "Token không hợp lệ"
      })
      return
    }

    //- chay toi day la cos user roi
    req.user = user //- muc dich la de ben controller ko can lay ra thong tin nua ma no da dc tra ve o day roi

    next()
  } else {
    res.json({
      code: 400,
      message: "Vui lòng gửi kèm token!"
    })
  }
}