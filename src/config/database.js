const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database.sqlite';

// Inicializa o banco de dados e cria as tabelas se não existirem
const db = new Database(path.resolve(DB_PATH));

db.exec(`
  CREATE TABLE IF NOT EXISTS "Order" (
    orderId      TEXT PRIMARY KEY,
    value        REAL NOT NULL,
    creationDate TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Items (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId   TEXT    NOT NULL,
    productId INTEGER NOT NULL,
    quantity  INTEGER NOT NULL,
    price     REAL    NOT NULL,
    FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
  );
`);

module.exports = db;
