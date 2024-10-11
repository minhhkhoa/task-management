const taskRouters = require("./task.route")

//- Nhungs file home
module.exports = (app) => {

  const version = "/api/v1"

  app.use(version + '/tasks', taskRouters)



}