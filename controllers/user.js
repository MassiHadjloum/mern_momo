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
export const signUpUser = (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req?.body
  User?.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: 'User already exists.' })
      } else if (password !== confirmPassword) {
        res.status(400).json({ message: 'password don\'t match' })
      } else {
        const hashedPass = bcrypt.hash(password, 12).then((hashpass) => {
          User.create({ email, password: hashpass, name: `${firstName} ${lastName}` })
            .then((user) => {
              const token = jwt.sign({ email: user?.email, id: user?._id }, 'test', { expiresIn: '1h' })
              res.json(200).json({ data: { user, token } })
            })
            .catch((err) => res.json(400).json({ message: "Error: can't creat user" }))
        }).catch((err) => res.json(400).json({ message: 'Error when crypting password' }))
      }
    })
    .catch((err) => res.status(500).json({ message: 'something went wrong!!!' }))
}
