const taskRouters = require("./task.route")
const userRouters = require("./user.route")
//- Nhungs file home
module.exports = (app) => {

  const version = "/api/v1"

  app.use(version + '/tasks', taskRouters)

  app.use(version + '/users', userRouters)

}