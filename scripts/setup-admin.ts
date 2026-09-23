import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
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
    // ADMIN_EMAIL is the OWNER account's LOGIN identity, not a mailbox. There is no
    // inbox behind admin@farjadp.info and mail sent to it hard-bounces, so never reuse
    // this as a notification recipient. Changing it here does not rename the existing
    // account either — upsert keys on email, so a new value creates a SECOND OWNER.
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
        process.exit(1);
    }

    try {
        console.log("🔒 Hashing admin password...");
        const hashedPassword = await bcrypt.hash(password, 12);

        console.log(`👤 Upserting admin user (${email}) to database...`);
        const adminUser = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: "OWNER", // Ensure they remain an OWNER
            },
            create: {
                email,
                name: "Admin",
                password: hashedPassword,
                role: "OWNER",
            },
        });

        console.log("✅ Admin user setup successfully!");
        console.log(`ID: ${adminUser.id}`);
    } catch (error) {
        console.error("❌ Failed to setup admin user:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
