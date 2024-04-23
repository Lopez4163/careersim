// Clear and repopulate the database.
const { PrismaClient } = require("@prisma/client")
//faker is not working for some reason, keeps producing undefined values
// const faker = require("@faker-js/faker")
const prisma = new PrismaClient()

const createUserWithPosts = async () => {
  try {
    const users = []
    for (let i = 0; i < 3; i++) {
      const user = await prisma.user.create({
        data: {
          username: `user${i + 1}`,
          password: `password${i + 1}`,
        },
      })
      users.push(user)

      for (let j = 0; j < 3; j++) {
        await prisma.post.create({
          data: {
            title: `post ${j + 1} of User ${i + 1}`,
            content: `content ${j + 1}`,
            userId: user.id,
          },
        })
      }
    }
    console.log("Users with posts created:", users)
    return users
  } catch (err) {
    console.error("Error creating users with posts:", err)
    throw err
  }
}

const main = async () => {
  createUserWithPosts()
  console.log("CREATED INSTRUCTORS")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
