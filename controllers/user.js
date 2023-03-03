import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signInUser = async (req, res) => {
  const { email, password } = req?.body
  console.log("email ", email);
  try {
    const user = await User?.findOne({ email })
    if (!user) return res?.status(404).json({ message: 'User doesn\'t exist' })

    const isPassword = await bcrypt.compare(password, user?.password)
    if (!isPassword) return res.status(400).json({ message: 'incorrect password' })
    console.log("user ", isPassword);
    const token = jwt.sign({ email: user?.email, id: user?._id }, 'test', { expiresIn: '1h' })
    return res.status(200).json({ result: { user, token } })
  } catch (err) {
    res.status(500).json({ message: 'something went wrong!!!' })
  }
}
export const signUpUser = async (req, res) => {
  console.log(req?.body);
  const { email, password, firstName, lastName, confirmPassword } = req?.body
  try {
    const user = await User?.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' })
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'password don\'t match' })
    const hashedPass = await bcrypt.hash(password, 12)
    const newUser = await User.create({ email, password: hashedPass, name: `${firstName} ${lastName}` })
    const token = jwt.sign({ email: newUser?.email, id: newUser?._id }, 'test', { expiresIn: '1h' })
    res.json(200).json({ result: { newUser, token } })
  } catch (err) {
    res.status(500).json({ message: 'something went wrong!!!' })
  }
}
