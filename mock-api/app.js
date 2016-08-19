'use strict';

const express = require('express');
const app = express();

const apiRoutes = require('./routes/api');
const staticRoutes = require('./routes/static');

app.use('/', staticRoutes);
app.use('/api/v1/', apiRoutes);

app.listen(8080);

console.log(`Server started on port 8080`);
