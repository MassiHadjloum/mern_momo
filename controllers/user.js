import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signInUser = async (req, res) => {
  const { email, password } = req?.body
  User?.findOne({ email }).then((response) => {
    // console.log(response);
    if (!response) {
      res?.status(404).json({ message: 'User doesn\'t exist' })
    } 
    else {
      const isPassword = bcrypt.compare(password, response?.password)
        .then((password) => {
          console.log("password ", password);
          if(password) {
            // ! sign jwt : we provide the info that we want to store in the token
            const token = jwt.sign({ email: response?.email, id: response?._id }, 'test', { expiresIn: '1h' })
            res.status(200).json({ data: { response, token } })
          }
          else {
            res.status(400).json({message: 'incorrect password'})
          }
        })
        .catch((errpassword) => res.status(400).json({ message: "incorrect password" }))
    }
    // console.log(isPassword);
  })
    .catch((err) => {
      res?.status(404).json({ message: 'User doesn\'t exist' })
    })
}
