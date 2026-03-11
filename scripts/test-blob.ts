import "dotenv/config";
process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_eNHX3uzddecqy6xC_figwjGSNcgQMAtayptigHnkDz9VpGt";
import { downloadAndWatermark } from "../src/lib/image-watermark";

async function run() {
  console.log("Starting test...");
  try {
    const output = await downloadAndWatermark(
      "https://picsum.photos/1792/1024.jpg",
      "test.jpg"
    );
    console.log("Success URL:", output);
  } catch (error) {
    console.error("Error during downloadAndWatermark:", error);
  }
}

run();
