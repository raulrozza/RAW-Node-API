const http = require('http');

const PORT = 3000;

const handler = (request, response) => {};

http.createServer(handler).listen(PORT, () =>
    console.log(`Server running at port ${PORT}`),
);
