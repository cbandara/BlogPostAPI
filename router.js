const express = require('express')
const router = express.Router()

// Do I need JSON/Body Parser?

const {BlogPosts} = require('./models')

// Sample Data
BlogPosts.create('title','content','author', Date.now())


router.get('/', (req, res) => {
  res.json(BlogPosts.get())
})


router.post('/', (req, res) => {
  
  const requiredFields = ["title","content","author", "publishDate"]
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message);
    }
  }

  const post = BlogPosts.create(
    req.body.title, 
    req.body.content,
    req.body.author, 
    req.body.publishDate)
  res.status(201).json(post)
})


router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  console.log(`Deleted blog posts: ${req.params.title}`)
  res.status(204).end()
})


router.put('/:id', (req, res) => {
  // Not Working
   const requiredFields = ["id", "title", "content", "author", "publishDate"]
   for (let i=0; i<requiredFields.length; i++) {
     const field = requiredFields[i];
   if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message);
     }
    }
  
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and 
    request body id (${req.body.id}) must match`
    console.error(message)
    return res.status(400).send(message);
  }
  console.log(req.body)
  console.log(`Updating blog post ${req.body.title}`)
  try {
    BlogPosts.update({
      id: req.body.id,
      // One version uses req.body and the other uses req.params??
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    })
  }
  catch (e) {
    console.log(e)
    res.status(400).send(e.message)
  }
  
   res.status(204).end()

})

module.exports = router;