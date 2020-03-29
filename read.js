const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  // The filename is simple the local directory and tacks on the requested url
  const filename = './downloads/cntraveller-12-Dec-19/nelayan-pool-14-malaysia-comp-nov19-pr.jpg';

  // This line opens the file as a readable stream
  const readStream = fs.createReadStream(filename);

  // This will wait until we know the readable stream is actually valid before piping
  readStream.on('open', () => {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });

  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream.on('error', (err) => {
    res.end(err);
  });
}).listen(8080);
