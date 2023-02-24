import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"


export const getPosts = (req, res) => {
  PostMessage.find().then((response) => {
    res.status(200).json({ response })
  })
    .catch((err) => {
      res.status(404).json({ message: err.message })
    })

}

export const createPost = (req, res) => {
  const post = req.body
  const newPost = new PostMessage(post)
  newPost.save().then((response) => {
    res.status(201).json({ data: newPost })
  })
    .catch((err) => {
      res.status(409).json({ message: err.message })
    })
}

export const updatePost = (req, res) => {
  const {id: _id} = req?.params
  const post = req?.body
  if(mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({messag: `No post with id ${_id}`})
  
  // add { new: true} to have the updated object from database
  PostMessage.findByIdAndUpdate(_id, post, {new: true})
  .then((response) => res?.status(202).json(response))
}