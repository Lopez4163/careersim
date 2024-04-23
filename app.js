const path = require("path")
const express = require("express")
const morgan = require("morgan")
const app = express()
const jwt = require("jsonwebtoken")
const PORT = process.env.PORT || 3000
require("dotenv").config()
// const { PrismaClient } = require("@prisma/client")
// const prisma = new PrismaClient()

// Logging middleware
app.use(morgan("dev"))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Backend routes
app.use("/auth", require("./auth"))
app.use("/api", require("./api"))

app.get("/", (req, res) => {
  res.send("test")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || "Internal server error.")
})

// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Not found.")
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
module.exports = app
