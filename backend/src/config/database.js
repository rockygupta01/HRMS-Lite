const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

const getStoragePath = () => {
  const configuredStorage = process.env.DB_STORAGE;

  if (configuredStorage) {
    return path.resolve(process.cwd(), configuredStorage);
  }

  return path.resolve(process.cwd(), "database/dev.sqlite");
};

const storagePath = getStoragePath();
fs.mkdirSync(path.dirname(storagePath), { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});

module.exports = sequelize;
