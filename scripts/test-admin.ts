import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const user = await prisma.user.findUnique({ where: { email: "admin@farjadp.info" } });
    console.log(user);
    if (!user) process.exit(1);

    const oldPassword = "Farjad!@#P.Info";
    const newPassword = "Farjad!@#P.InfoAzizeBoom!";
    console.log("old password hash matches?", await bcrypt.compare(oldPassword, user.password as string));
    console.log("new password hash matches?", await bcrypt.compare(newPassword, user.password as string));
}
main().finally(() => prisma.$disconnect());
