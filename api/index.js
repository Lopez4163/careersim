const router = require("express").Router()

router.use("/post", require("./post"))

module.exports = router
