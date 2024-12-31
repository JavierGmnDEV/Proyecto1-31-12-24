//este middleware sirve para mandarle un json a una base de datos de phpmysql
const express = require('express');

// Middleware para manejar JSON
const parseJson = express.json();

module.exports = parseJson;

