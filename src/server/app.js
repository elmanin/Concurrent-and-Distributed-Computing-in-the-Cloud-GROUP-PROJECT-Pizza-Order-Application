const app = require("./server");

function startServer() {
  const port = process.env.PORT || 8080;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}

startServer();
