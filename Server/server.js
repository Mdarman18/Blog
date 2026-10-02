import app from "./app.js";

import { env } from "./src/config/env.js";

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    app.listen(PORT, () => {});
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
