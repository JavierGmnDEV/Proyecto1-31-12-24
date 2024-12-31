const express = require('express');
const {Router} = require('express');

const { pool } = require ("../db.js");
const router = Router()

router.get('/ping', async (req,res) => {
   const [rows] =  await pool.query("SELECT 1 + 1 as result");
   console.log(rows);
   res.json(rows)
})
module.exports = router;