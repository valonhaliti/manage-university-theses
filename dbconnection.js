const mysql = require('mysql');

class Database {
    constructor() {
        this.config = {
            connectionLimit: 50,
            host: process.env.DB_HOST_NAME,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            insecureAuth: true
        }
        this.connection = mysql.createConnection(this.config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            })
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = Database;

