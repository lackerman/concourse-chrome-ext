'use strict';

const pipelines = require('./data/pipelines.json');
const brokenJobs = require('./data/broken-pipeline-jobs.json');
const workingJobs = require('./data/working-pipeline-jobs.json');

const express = require('express');
const router = express.Router();

router.get('/pipelines', (req, res) => {
  res.json(pipelines);
});

router.get('/pipelines/:pipeline/jobs', (req, res) => {
  if (req.params.pipeline === 'broken-pipeline') {
    res.json(brokenJobs);
  } else {
    res.json(workingJobs);
  }
});

module.exports = router;
