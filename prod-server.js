const FastBootAppServer = require('fastboot-app-server');
const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const setupApiServer = require('./server/api-server');

const httpServer = new ExpressHTTPServer(/* {options} */);
setupApiServer(httpServer.app);
let server = new FastBootAppServer({
  httpServer,
  distPath: 'dist',
  gzip: true, // Optional - Enables gzip compression.
  host: '0.0.0.0', // Optional - Sets the host the server listens on.
  port: 4000, // Optional - Sets the port the server listens on (defaults to the PORT env var or 3000).
});

server.start();
