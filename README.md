## .env:

- PORT=5000
- MONGODB_URI="mongodb+srv://Dat:Dat.050996@m31-coder-car.pajl4wx.mongodb.net/M31-Final-Project"

## End point and body request

- Get all user: method GET
  http://localhost:5000/user?name="userName"

  ***

- Create user: method POST/ body request: name, role

  body request: {"name": "Nguyen Van A","role": "employee"}

  http://localhost:5000/user

  ***

- Update user: method PUT/ body request: name, role

  body request: {"name": "Nguyen Van A","role": "employee"}

  http://localhost:5000/user/:userID

  ***

- Get all task: method GET
  http://localhost:5000/task?status="task Status"

  ***

- Get all task of 1 user: method GET
  http://localhost:5000/task/user/:userId

  ***

- Get a single task by id: method GET
  http://localhost:5000/task/:taskId

  ***

- Create a task: method POST

  body request:
  {
  "name": "don nha",
  "description": "don 10 can villas trong 1 gio",
  "status":"pending"
  }

  http://localhost:5000/task

  ***

- Update a task status: method PUT

  body request: {"status":"working"}

  http://localhost:5000/task/status/:taskId

  ***

- Assign Task to user: method PUT

  body request: {"userId":"63e5791031d930a71824197b"}
  body request: {"userId":null} unassign task

  http://localhost:5000/task/assign/:taskId

  ***

- Delete a task: method DELETE

  http://localhost:5000/task/:taskId
