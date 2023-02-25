import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"


export const getPosts = (req, res) => {
  PostMessage.find().then((response) => {
    console.log(response);
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
  const { id: _id } = req?.params
  const post = req?.body
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ messag: `No post with id ${_id}` })
  // add { new: true} to have the updated object from database
  PostMessage.findByIdAndUpdate(_id, post, { new: true })
    .then((response) => res?.status(202).json(response))
}
export const deletePost = (req, res) => {
  const { id: _id } = req?.params
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ messag: `No post with id ${_id}` })
  PostMessage.findByIdAndDelete(_id)
    .then((response) => res?.status(200).json({ message: `Post with id ${_id} has benn deleted.` }))
}

export const likePost = (req, res) => {
  const { id: _id } = req?.params
  const likeCount = req?.body
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ messag: `No post with id ${_id}` })
  // add { new: true} to have the updated object from database
  const post = PostMessage.findById(_id)
    .then((response) => PostMessage.findByIdAndUpdate(_id, { likeCount: response?.likeCount + 1 },
      { new: true })
      .then((response) => res.json(response))
      .catch((err) => res.json({ message: 'An error has occured while liking a post' }))
    )


}