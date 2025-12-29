const app = require("./server");


function startServer() {
    const port = 8080;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    })
}

startServer();