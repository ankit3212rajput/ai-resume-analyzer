const app = require("./src/app");
const env = require("./src/config/env");
const connectDatabase = require("./src/database/connectDatabase");

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`Backend API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();
