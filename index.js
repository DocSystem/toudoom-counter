const express = require("express");
const expressWs = require("express-ws");
const app = express();

const port = 80;

expressWs(app);

const LIVES = [];

let counter = 0;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/user.html");
});

app.get("/live", (req, res) => {
    res.sendFile(__dirname + "/live.html");
});

app.ws("/ws", (ws, req) => {
    ws.on("message", (msg) => {
        const data = JSON.parse(msg);
        if (data.type === "counter") {
            counter = data.counter;
            LIVES.forEach((live) => {
                try {
                    live?.send(JSON.stringify({type: "counter", counter}));
                } catch (e) {
                    console.error(e);
                }
            });
        }
    });
    ws.send(JSON.stringify({ type: "counter", counter }));
});

app.ws("/live/ws", (ws, req) => {
    LIVES.push(ws);
    ws.on("close", () => {
        LIVES.splice(LIVES.indexOf(ws), 1);
    });
    ws.send(JSON.stringify({ type: "counter", counter }));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
