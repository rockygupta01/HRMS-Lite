const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5001;
let server;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    server = app.listen(PORT, () => {
      console.log(`HRMS Lite backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

const shutdown = async () => {
  if (server) {
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
    return;
  }

  await sequelize.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
