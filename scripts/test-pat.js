require('dotenv').config({ path: '.env.vercel.prod' });
const pat = process.env.GITHUB_PAT;
console.log("Locally pulled Vercel PAT ends with:", pat.slice(-4));
