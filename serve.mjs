import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const files = new Map([
  ["index.html", "text/html"],
  ["before.html", "text/html"],
  ["after.html", "text/html"],
  ["demo.css", "text/css"],
  ["demo.js", "text/javascript"],
  ["vendor/before.js", "text/javascript"],
  ["vendor/after.js", "text/javascript"],
  ["fixtures/before.html", "text/html"],
  ["fixtures/after.html", "text/html"],
  ["fixtures/first/README.md", "text/plain"],
  ["fixtures/second/README.md", "text/plain"],
  ["fixtures/first/snippet.js", "text/javascript"],
  ["fixtures/second/snippet.js", "text/javascript"],
]);

const server = createServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname.slice(1) || "index.html";
  const type = files.get(path);
  if (!type) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const body = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, { "Content-Type": type + "; charset=utf-8", "Cache-Control": "no-store" });
    response.end(body);
  } catch (error) {
    console.error(error.message);
    response.writeHead(500).end("Fixture file could not be loaded");
  }
});
server.listen(Number(process.env.PORT || 8000), process.env.HOST || "0.0.0.0", () => {
  console.log("Docsify repro at http://localhost:" + server.address().port + "/");
});
