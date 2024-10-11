const mongoose = require("mongoose")

//- cai nay dung de khi ng ta an quen mat khau thi no se tu 
//- tao ra cai collection nay trong db va luu thong tin tk can doi pass
//- kem theo ma otp vao db. Boi vi co th ma gui song thi 2p sau ngta moi nhap otp 
//- vi the nen ta can 1 document de doi chieu vs input otp ngdung nhap vao
//- va collection nay se dc xoa di sau 1 khoang time nao do vd: 5p sau khi gui otp
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    //- cu phap de tu xoa di collection vs mongoose
    expireAt: {//- time het han
      type: Date,
      expires: 180 //- tinh tu luc hien tai + 3p thi no se mat
    } 
  },
  {
    timestamps: true
  }
)

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = ForgotPassword