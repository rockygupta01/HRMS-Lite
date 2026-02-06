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

const getSequelizeConfig = () => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }

  const storagePath = getStoragePath();
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });

  return new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
  });
};

const sequelize = getSequelizeConfig();

module.exports = sequelize;
