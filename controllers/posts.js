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
  const newPost = new PostMessage({...post, creator: req?.userid, createAt: new Date()?.toISOString()})
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
  // const likeCount = req?.body
  if (!req?.userId) return res.json({ message: 'Unautenticated' })
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ messag: `No post with id ${_id}` })
  // add { new: true} to have the updated object from database
  PostMessage.findById(_id)
    .then((post) => {
      const index = post?.likes.findIndex((id) => id === String(req?.userId))
      if(index === -1) {
        // ? like a post
        post?.likes?.push(req?.userId)
      } else {
        // ? dislike a post
        post?.likes?.splice(index, 1)
      }
      PostMessage.findByIdAndUpdate(_id, post,
        { new: true })
        .then((post) => res.json(post))
        .catch((err) => res.json({ message: 'An error has occured while liking a post' }))
    }
    )


}