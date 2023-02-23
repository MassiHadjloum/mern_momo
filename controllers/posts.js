import PostMessage from "../models/postMessage.js"


export const getPosts = (req, res) => {
  PostMessage.find().then((response) => {
    console.log(response)
    res.status(200).json({ data: response })
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