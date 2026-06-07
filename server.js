var http = require("http");
var fs = require("fs");
var path = require("path");

var port = process.env.PORT || 4173;
var root = __dirname;
var types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8"
};

http
  .createServer(function (req, res) {
    var urlPath = decodeURIComponent(req.url.split("?")[0]);
    var filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);

    if (filePath.indexOf(root) !== 0) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, function (error, data) {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, function () {
    console.log("Control Monotributo app: http://localhost:" + port);
  });
