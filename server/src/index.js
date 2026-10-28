import "dotenv/config";
import { createApp } from "./app.js";
import { prisma } from "./db.js";

const app = createApp();

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";

app.listen(port, host, async () => {
  console.log(`FarmCare API berjalan di http://${host}:${port}`);
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Koneksi database: OK");
  } catch (error) {
    const lines = error.message
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    console.log("Koneksi database GAGAL:", lines[lines.length - 1]);
  }
});
