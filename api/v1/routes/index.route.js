const taskRouters = require("./task.route")
const userRouters = require("./user.route")

const authMiddleware = require("../middleware/auth.middleware")

//- Nhungs file home
module.exports = (app) => {

  const version = "/api/v1"
  
  //- cac route con cua tasks deu can bao mat
  app.use(
    version + '/tasks',
    authMiddleware.requireAuth,
    taskRouters
  )

  app.use(version + '/users', userRouters)

}