// An instructor can only access their own students' data.
const router = require("express").Router()
const express = require("express")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

//middleware
router.use(express.json())

//middleware to create req.user for JWT
router.use((req, res, next) => {
  const auth = req.headers.authorization
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null
  if (token) {
    req.user = jwt.verify(token, process.env.JWT)
  } else {
    req.user = null
  }
  next()
})

// Get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany()
    res.send(posts)
  } catch (error) {
    next(error)
  }
})
//

// Get a post by id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    })
    if (!post) {
      return res.status(404).send("Post not found.")
    }

    res.send(post)
  } catch (error) {
    next(error)
  }
})

// Create a new post
router.post("/create", async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id,
      },
    })
    res.status(201).send(post)
  } catch (error) {
    next(error)
  }
})

// Update a post
router.put("/create/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
      // Return the updated student object
      include: {
        user: true,
      },
    })

    if (!post) {
      return res.status(404).send("Post not found.")
    }

    res.send(post)
  } catch (error) {
    next(error)
  }
})

// Delete a post by id
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id), // Convert id to integer
        userId: req.user.id,
      },
    })

    if (!post) {
      return res.status(404).send("Post not found.")
    }

    res.send(post)
  } catch (error) {
    next(error)
  }
})

module.exports = router
