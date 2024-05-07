import bcrypt from "bcryptjs"

const users = [
  {
    name: "Admin User",
    email: "neoyongtai1@gmail.com",
    password: bcrypt.hashSync("7584578Ee##", 10),
    isAdmin: true,
  },
]

export default users
