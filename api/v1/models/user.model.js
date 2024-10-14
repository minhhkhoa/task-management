const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  //tham so thu 2
  {
    timestamps: true
  })

const User = mongoose.model('User', userSchema, "users")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = User