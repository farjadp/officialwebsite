import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const post = await prisma.post.findFirst({
    where: { title: { contains: "Developer Knowledge API" } }
  })
  console.log("Cover Image:", post?.coverImage)
}
main().catch(console.error).finally(() => prisma.$disconnect())
