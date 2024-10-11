const mongoose = require("mongoose")
const generate = require("../../../helpers/generate")

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20)
    },
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