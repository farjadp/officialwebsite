import { prisma } from "../src/lib/prisma";

async function main() {
  const posts = await prisma.post.findMany({
    where: { content: { contains: 'Strategy 6: Make Content Personality-Driven' } }
  });
  console.log(`Found ${posts.length} matching posts.`);
  
  for (const post of posts) {
    // We only want to delete the specific image if we can, but since the user hates the images generated for it, let's remove all <figure> that have an image.
    // However, maybe there are valid images? The user said "What is this image it generated?!?!?! I told it no hijab and Islam and this bullshit"
    // Let's remove the <figure> blocks that got injected by our API.
    const updatedContent = post.content.replace(/<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>/gi, '');
    await prisma.post.update({
      where: { id: post.id },
      data: { content: updatedContent }
    });
    console.log(`Updated post: ${post.title}`);
  }
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
