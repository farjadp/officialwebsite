// Removed dotenv

import { generateWaterfall } from "./src/lib/social-publisher";

async function main() {
    const text = `Small businesses are bleeding capital every single month because they refuse to automate. I see agency owners hiring virtual assistants to copy-paste data between their CRM and accounting software. This is not scaling; this is adding human band-aids to broken processes. An AI agent could do this 24/7 without errors.`;
    console.log("Generating waterfall...");
    const result = await generateWaterfall(text);
    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
