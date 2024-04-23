const router = require("express").Router()
const express = require("express")
const { PrismaClient } = require("@prisma/client")
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()
//Middleware
router.use(express.json())

// Register a new account
router.post("/register", async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
      },
    })

    // Create a token with the user id
    const token = jwt.sign({ id: user.id }, process.env.JWT)

    res.status(201).send({ token })
  } catch (error) {
    next(error)
  }
})

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    })

    if (!user) {
      return res.status(401).send("Invalid login credentials.")
    }

    // Create a token with the user id
    const token = jwt.sign({ id: user.id }, process.env.JWT)

    const decodedToken = jwt.verify(token, process.env.JWT)
    console.log("User ID from token:", decodedToken.id)

    res.send({ token })
    console.log("LOGGED IN")
    console.log(token)
  } catch (error) {
    next(error)
  }
})

// Get the currently logged in user
router.get("/me", async (req, res, next) => {
  try {
    if (req.user) {
      const instructor = await prisma.instructor.findUnique({
        where: {
          id: req.user?.id,
        },
      })
      res.send(instructor)
    } else {
      res.send("")
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
