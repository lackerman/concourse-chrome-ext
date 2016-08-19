'use strict';

const express = require('express');
const router = express.Router();
const directory = `${__dirname}/static`;

router.get('/pipelines/:pipeline', (req, res) => {
  res.sendFile(`${req.params.pipeline}.html`, {
    root: `${directory}/`,
  }, (error) => {
    if (error) {
      res.status(error.status).end();
    }
  });
});

module.exports = router;
