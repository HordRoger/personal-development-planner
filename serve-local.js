const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function getLocalAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((networkInterface) => {
      return (
        networkInterface &&
        networkInterface.family === "IPv4" &&
        !networkInterface.internal
      );
    })
    .map((networkInterface) => networkInterface.address);
}

function resolveRequestPath(requestUrl) {
  const cleanUrl = decodeURIComponent(requestUrl.split("?")[0]);
  const relativePath = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = path.normalize(path.join(ROOT, relativePath));

  if (!filePath.startsWith(ROOT)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Planner disponibile su questo PC: http://localhost:${PORT}/`);
  getLocalAddresses().forEach((address) => {
    console.log(`Planner disponibile in rete locale: http://${address}:${PORT}/`);
  });
});
