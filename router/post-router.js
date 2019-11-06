const express = require('express')
const router = express.Router()
const Posts = require('../data/db.js')

// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  const { title, contents } = req.body

  if (!title || !contents) {
    res.status(400).json({ Message: 'Provide both a title and contents' })
  } else {
    Posts.insert(req.body)
      .then(p => res.status(201).json(p))
      .catch(e => res.status(500).json({ Message: e }))
  }
})
module.exports = router

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', async (req, res) => {
  const info = { ...req.body, id: req.params.id }
  try {
    const comment = await Posts.insertComment(info)
    res.status(201).json(comment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
  Posts.find(req.query).then(p => res.status(200).json(p))
})

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      res.status(505).json({ error })
    })
})

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
  Posts.findCommentById(req.query).then(comment =>
    res.status(200).json(comment)
  )
})

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
      post > 0
        ? res.status(200).json({ post })
        : res.status(404).json({ Message: 'Post not found' })
    })
    .catch(error => res.status(500).json({ error }))
})

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
  const change = req.body
  Posts.update(req.params.id, change)
    .then(post => {
      post
        ? res.status(200).json(post)
        : res.status(404).json({ Message: 'Post not found' })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ Message: error })
    })
})
