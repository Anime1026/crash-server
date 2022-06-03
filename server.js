const axios = require("axios");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var express = require("express");
require("dotenv").config();
var app = express();
var cors = require("cors");
const Console = require("console");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var gameSocket = null;
let sockets = [];
let users = [];
let history = [];

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/build"));

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/build/index.html', function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

server.listen(5001, function () {
    console.log("listening --- server is running ...");
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let mul = 1.01;
const PLAYING = 2;
const READY = 1;
const BET = 0;
const GAMEEND = 3;
let GameState = BET;
axios.defaults.headers.common["Authorization"] = process.env.SECRETCODE;

const READYTIME = 3000;
const BETINGTIME = 10000;
const GAMEENDTIME = 5000;
let startTime = Date.now();
let gameTime = getRandom().toFixed(2);

setInterval(() => {
    switch (GameState) {
        case BET:
            if (Date.now() - startTime > BETINGTIME) {
                GameState = READY;
                startTime = Date.now();
            }
            break;
        case READY:
            if (Date.now() - startTime > READYTIME) {
                GameState = PLAYING;
                startTime = Date.now();
                gameTime = getRandom().toFixed(2);
                mul = 1.01;
            }
            break;
        case PLAYING:
            console.log(Date.now() - startTime);
            mul += 0.01 + (Date.now() - startTime) ^ 2 / 1000;

            if (mul > gameTime) {
                GameState = GAMEEND;
                startTime = Date.now();
            }

            break;
        case GAMEEND:
            if (Date.now() - startTime > GAMEENDTIME) {
                startTime = Date.now();
                GameState = BET;
                users.map((user) => {
                    user.cashouted = false;
                    user.betted = false;
                    user.amount = 0;
                    user.multipier = 1.00;
                    user.crashed = false;
                }
                );

                history.push(mul);
                let temp = [];

                if (history.length < 8) {
                    for (let i = 0; i < 8 - history.length; i++) {
                        temp[i] = 0;
                    }
                    for (let i = temp.length; i < 8; i++) {
                        temp[i] = history[i - temp.length];
                    }
                }
                else {
                    for (let i = 0; i < 8; i++) {
                        temp[i] = history[history.length - 8 + i];
                    }
                }

                history = temp;

                sockets.map((socket) => {
                    socket.emit("history", { history: history });
                });

            }
            break;
    }

}, 20)

// Implement socket functionality
gameSocket = io.on("connection", function (socket) {
    sockets.push(socket);
    console.log("socket connected: " + socket.id);
    try {

        socket.on("disconnect", function () {
            console.log("socket disconnected: " + socket.id);

        });

        socket.on("enterroom", (data, callback) => {
            users[data.token] = {
                id: socket.id,
                name: data.name,
                amount: data.amount,
                betted: data.betted,
                multipier: data.multipier,
                cashouted: data.cashouted,
                crashed: data.crashed,
                token: data.token
            }

            sockets.map((socket) => {
                socket.emit("history", { history: history });
            });

            callback({
                status: 1,
                message: socket.id,
                data: 0
            });
        });

        socket.on("state update", (data) => {
            socket.emit('crash', {
                gamestate: GameState,
                progress: (Date.now() - startTime).toFixed(2),
                mul: mul.toFixed(2)
            });
        });

        socket.on("playerbet", async (data) => {
            var user = users[data.token];
            user.amount = data.amount;
            user.betted = data.betted;
            user.token = data.token;
            user.name = data.name;
            user.multipier = 0;
            if (data.token != "demo") {
                try {
                    await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
                        token: user.token,
                        amount: user.amount
                    });
                } catch {
                    throw new Error("Bet Error!");
                }
            }

            emitAllUserlist(user);

            socket.emit("bet response", {
                status: 1,
                message: `You betted ${data.amount} successfully.`,
                data: data.amount
            });
        });

        socket.on("playercashout", async (data) => {
            var user = users[data.token];
            user.cashouted = data.cashouted;
            user.multipier = data.multipier;

            if (data.token != "demo") {
                try {
                    await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
                        token: user.token,
                        amount: user.amount * user.multipier,
                        winState: true
                    });
                } catch {
                    throw new Error("Can't find Server!");
                }
            }

            emitAllUserlist(user);

            sockets.map((_socket) => {
                _socket.emit("betted", {
                    username: user.name,
                    mul: user.multipier
                });
            });

            socket.emit("cashout result", {
                status: 1,
                earnAmount: user.amount * user.multipier,
                message: `You cashouted ${(user.amount * user.multipier).toFixed(0)} successfully.`,
                data: 0
            });
        })

        socket.on("crashed", (data, callback) => {
            let crashedAmount = data.amount * data.multipier;

            // interacting with platform

            callback({
                status: 1,
                message: `You are Crashed..`,
                data: crashedAmount
            });
        });

    } catch (err) {
        socket.emit("error message", { "errMessage": err.message })
    }
});

function emitAllUserlist(user) {
    sockets.map((_socket) => {
        // let _users = users.filter((user) => user.id != _socket.id);
        _socket.emit("userslist", { users: user });
    });
}

function getRandom() {
    var r = Math.random();
    var offset = 0.00002;
    var tar = (1 + offset) / (r + 2 * offset)
    return tar + 0.1;
}