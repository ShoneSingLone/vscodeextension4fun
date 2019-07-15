const fs = require("fs");

exports.writeFile = function writeFile(file, data, encoding = "utf-8") {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, encoding, function (err) {
            if (err) reject(err);
            else resolve(file + " write sucess.");
        });
    });
};
exports.appendFile = function writeFile(file, data, encoding = "utf-8") {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data, encoding, function (err) {
            if (err) reject(err);
            else resolve(file + " write sucess.");
        });
    });
};

exports.readFile = function (file, encoding = "utf-8") {
    return new Promise((resolve, reject) => {
        fs.readFile(file, encoding, function (err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
};