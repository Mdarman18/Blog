import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {});
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
