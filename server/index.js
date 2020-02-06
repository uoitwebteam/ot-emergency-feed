const express = require('express');
const cors = require('cors');

const {
  PollingSocketServer
} = require('mighty-polling-socket-server');
const {
  SOURCE_LIST
} = require('./sources');

const pss = new PollingSocketServer({
  defaultInterval: 60000,
  checkHeartbeat: true,
  logging: true
});

pss.app.use(cors());
pss.app.use(express.static('dist'));
pss.app.use(express.static('server/xml'));
pss.sources(SOURCE_LIST);
pss.broadcast(process.env.PORT || 8080);