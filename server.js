const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const bodyParser = require('body-parser')

const {BlogPosts} = require('./models')

const jsonParser = bodyParser.json()

app.use(morgan('common'));

// Sample Data
BlogPosts.create('title','content','author', Date.now())

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get())
})

app.post('/blog-posts', jsonParser, (req, res) => {
  const requiredFields = ['title','content','author', 'publishDate']
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \'${field}\ in request body`
      console.error(message)
      return res.status(400).send(message);
    }
  }

  const post = BlogPosts.create(req.body.title, req.body.content,
     req.body.author, req.body.publishDate)
     res.status(201).json(post)
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`app listening on port ${process.env.PORT || 8080}`)
})