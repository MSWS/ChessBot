// ==UserScript==
// @name         Chess.com Bot/Cheat
// @namespace
// @version      1.2
// @description  Chess.com Bot/Cheat that finds the best move!
// @author       MrAuzzie
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource    stockfish.js        https://raw.githubusercontent.com/Auzgame/remote/main/stockfish.js
// @require     https://greasyfork.org/scripts/445697/code/index.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-start
// @antifeature   ads
// ==/UserScript==

// Don't touch anything below unless you know what your doing!

"use strict";

const currentVersion = "1.2"; // Sets the current version

let isThinking = false;
let canGo = true;
let myTurn = false;

/**
 *
 */
function main() {
    let stockfishObjectURL;
    const engine = document.engine = {};
    const mylets = document.mylets = {};
    mylets.autoMovePiece = false;
    mylets.autoRun = false;
    mylets.delay = 0.1;
    const myFunctions = document.myFunctions = {};

    let stopW = 0;
    let stopB = stopW;
    let sWr2 = 0, sWr = sWr2, sBr2 = sWr, sBr = sBr2;

    myFunctions.rescan = function () {
        const ari = $("chess-board")
            .find(".piece")
            .map(function () {
                return this.className;
            })
            .get();
        let jack = ari.map(f => f.substring(f.indexOf(" ") + 1));
        /**
         *
         * @param arr
         * @param word
         */
        function removeWord(arr, word) {
            for (let i = 0; i < arr.length; i++)
                arr[i] = arr[i].replace(word, "");
        }
        removeWord(ari, "square-");
        jack = ari.map(f => f.substring(f.indexOf(" ") + 1));
        for (let i = 0; i < jack.length; i++) {
            jack[i] = jack[i].replace("br", "r")
                .replace("bn", "n")
                .replace("bb", "b")
                .replace("bq", "q")
                .replace("bk", "k")
                .replace("bb", "b")
                .replace("bn", "n")
                .replace("br", "r")
                .replace("bp", "p")
                .replace("wp", "P")
                .replace("wr", "R")
                .replace("wn", "N")
                .replace("wb", "B")
                .replace("br", "R")
                .replace("wn", "N")
                .replace("wb", "B")
                .replace("wq", "Q")
                .replace("wk", "K")
                .replace("wb", "B");
        }
        let str2 = "";
        let count = 0, str = "";
        for (let j = 8; j > 0; j--) {
            for (let i = 1; i < 9; i++) {
                str = (jack.find(el => el.includes([i] + [j]))) ? str = str.replace(/[^a-zA-Z]+/g, "") : str = "";
                if (str === "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString();
                    }
                }
                str2 += str;
                if (i === 8) {
                    count = 0;
                    str2 += "/";
                }
            }
        }
        str2 = str2.slice(0, -1);

        let color = "";
        let bq = "0", bk = bq, wq = bq, wk = bq;
        const move = $("vertical-move-list")
            .children();
        if (move.length < 2)
            stopB = stopW = sBr = sBr2 = sWr = sWr2 = 0;

        if (stopB !== 1) {
            if (move.find(".black.node:contains('K')")
                .length) {
                bk = "";
                bq = "";
                stopB = 1;
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stopB !== 1) {
            bk = ((move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "k"))
                ? (bq = (move.find(".black.node:contains('O-O-O')").length) ? bk = "" : "q")
                : bq = "";
        }
        if (sBr !== 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match("[abcd]+")) {
                bq = "";
                sBr = 1;
            }
        } else bq = "";
        if (sBr2 !== 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match("[hgf]+")) {
                bk = "";
                sBr2 = 1;
            }
        } else bk = "";
        if (stopB === 0) {
            if (sBr === 0) {
                if (move.find(".white.node:contains('xa8')")
                    .length > 0) {
                    bq = "";
                    sBr = 1;
                }
            }
            if (sBr2 === 0) {
                if (move.find(".white.node:contains('xh8')")
                    .length > 0) {
                    bk = "";
                    sBr2 = 1;
                }
            }
        }
        if (stopW !== 1) {
            if (move.find(".white.node:contains('K')")
                .length) {
                wk = "";
                wq = "";
                stopW = 1;
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stopW !== 1) {
            wk = ((move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))")
                .length)
                ? ""
                : "K")
                ? (wq = (move.find(".white.node:contains('O-O-O')")
                    .length)
                    ? wk = ""
                    : "Q")
                : wq = "";
        }
        if (sWr !== 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match("[abcd]+")) {
                wq = "";
                sWr = 1;
            }
        } else wq = "";
        if (sWr2 !== 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match("[hgf]+")) {
                wk = "";
                sWr2 = 1;
            }
        } else wk = "";
        if (stopW === 0) {
            if (sWr === 0) {
                if (move.find(".black.node:contains('xa1')")
                    .length > 0) {
                    wq = "";
                    sWr = 1;
                }
            }
            if (sWr2 === 0) {
                if (move.find(".black.node:contains('xh1')")
                    .length > 0) {
                    wk = "";
                    sWr2 = 1;
                }
            }
        }
        if ($(".coordinates")
            .children()
            .first()
            .text() === 1)
            str2 = str2 + " b " + wk + wq + bk + bq;
        // color = "white";
        else
            str2 = str2 + " w " + wk + wq + bk + bq;
        // color = "black";


        return str2;
    };
    myFunctions.color = function (dat) {
        const response = dat;
        let res1 = response.substring(0, 2);
        let res2 = response.substring(2, 4);

        if (mylets.autoMove == true)
            myFunctions.movePiece(res1, res2);

        isThinking = false;

        res1 = res1.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        res2 = res2.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        $("chess-board")
            .prepend("<div class=\"highlight square-" + res2 + " bro\" style=\"background-color: rgb(235, 97, 80); opacity: 0.71;\" data-test-element=\"highlight\"></div>")
            .children(":first")
            .delay(1800)
            .queue(function () {
                $(this)
                    .remove();
            });
        $("chess-board")
            .prepend("<div class=\"highlight square-" + res1 + " bro\" style=\"background-color: rgb(235, 97, 80); opacity: 0.71;\" data-test-element=\"highlight\"></div>")
            .children(":first")
            .delay(1800)
            .queue(function () {
                $(this)
                    .remove();
            });
    };

    myFunctions.movePiece = function (from, to) {
        for (const each in $("chess-board")[0].game.getLegalMoves()) {
            if ($("chess-board")[0].game.getLegalMoves()[each].from === from) {
                if ($("chess-board")[0].game.getLegalMoves()[each].to === to) {
                    const move = $("chess-board")[0].game.getLegalMoves()[each];
                    $("chess-board")[0].game.move({
                        ...move,
                        promotion: "false",
                        animate: false,
                        userGenerated: true
                    });
                }
            }
        }
    };

    /**
     *
     * @param e
     */
    function parser(e) {
        if (e.data.includes("bestmove")) {
            console.log(e.data.split(" ")[1]);
            myFunctions.color(e.data.split(" ")[1]);
            isThinking = false;
        }
    }

    myFunctions.reloadChessEngine = function () {
        console.log("Reloading the chess engine!");

        engine.engine.terminate();
        myFunctions.loadChessEngine();
    };

    myFunctions.loadChessEngine = function () {
        if (!stockfishObjectURL)
            stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));

        console.log(stockfishObjectURL);
        if (stockfishObjectURL) {
            engine.engine = new Worker(stockfishObjectURL);

            engine.engine.onmessage = e => {
                parser(e);
            };
            engine.engine.onerror = e => {
                console.log("Worker Error: " + e);
            };

            engine.engine.postMessage("ucinewgame");
        }
        console.log("loaded chess engine");
    };

    let lastValue = 10;
    myFunctions.runChessEngine = function (depth) {
        const fen = myFunctions.rescan();
        engine.engine.postMessage(`position fen ${fen} - - 0 25`);
        console.log("updated: " + `position fen ${fen} - - 0 25`);
        isThinking = true;
        engine.engine.postMessage(`go depth ${depth}`);
        lastValue = depth;
    };

    myFunctions.autoRun = function (lstValue) {
        if ($("chess-board")[0].game.getTurn() == $("chess-board")[0].game.getPlayingAs())
            myFunctions.runChessEngine(lstValue);
    };

    const keyIndicies = "QWERTYUIOPASDFGHJKLZXCVBNM";

    document.onkeydown = function (e) {
        if (e.key in keyIndicies)
            myFunctions.runChessEngine(keyIndicies.indexOf(e.key) + 1);
        else {
            switch (e.key) {
                case "Backspace":
                    myFunctions.reloadChessEngine();
                    break;
                case "Enter":
                    myFunctions.autoRun(lastValue);
                    break;
                case "Escape":
                    myFunctions.autoMove = !myFunctions.autoMove;
                    break;
            }
        }
    };

    myFunctions.spinner = function () {
        $("#overlay")[0].style.display = isThinking ? "block" : "none";
    };

    let dynamicStyles = null;

    /**
     *
     * @param body
     */
    function addAnimation(body) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement("style");
            dynamicStyles.type = "text/css";
            document.head.appendChild(dynamicStyles);
        }

        dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }

    let loaded = false;
    myFunctions.loadEx = function () {
        try {
            const div = document.createElement("div");
            const content = `<br><input type="checkbox" id="autoRun" name="autoRun" value="false">
<label for="autoRun"> Enable auto run</label><br>
<input type="checkbox" id="autoMove" name="autoMove" value="false">
<label for="autoMove"> Enable auto move</label><br>
<input type="number" id="timeDelay" name="timeDelay" min="0.1" value=0.1>
<label for="timeDelay">Auto Run Delay (Seconds)</label>`;

            div.innerHTML = content;
            div.setAttribute("style", "background-color:white; height:auto;");
            div.setAttribute("id", "settingsContainer");

            $("chess-board")[0].parentElement.parentElement.appendChild(div);

            //spinnerContainer
            const spinCont = document.createElement("div");
            spinCont.setAttribute("style", "display:none;");
            spinCont.setAttribute("id", "overlay");
            div.prepend(spinCont);
            //spinner
            const spinr = document.createElement("div");
            spinr.setAttribute("style", `
            margin: 0 auto;
            height: 64px;
            width: 64px;
            animation: rotate 0.8s infinite linear;
            border: 5px solid firebrick;
            border-right-color: transparent;
            border-radius: 50%;
            `);
            spinCont.appendChild(spinr);
            addAnimation(`@keyframes rotate {
                           0% {
                               transform: rotate(0deg);
                              }
                         100% {
                               transform: rotate(360deg);
                              }
                                           }`);
            loaded = true;
        } catch (error) { console.log(error); }
    };


    /**
     *
     * @param delay
     */
    function other(delay) {
        const endTime = Date.now() + delay;
        let timer = setInterval(() => {
            if (Date.now() >= endTime) {
                myFunctions.autoRun(lastValue);
                canGo = true;
                clearInterval(timer);
            }
        }, 10);
    }


    /**
     *
     */
    async function getVersion() {
        const GF = new GreasyFork(); // set upping api
        const code = await GF.get().script().code(460208); // Get code
        const version = GF.parseScriptCodeMeta(code).filter(e => e.meta === "@version")[0].value; // filtering array and getting value of @version

        if (currentVersion !== version) {
            alert("A new version is available!");
        }
    }

    getVersion();

    const waitForChessBoard = setInterval(() => {
        if (loaded) {
            mylets.autoRun = $("#autoRun")[0].checked;
            mylets.autoMove = $("#autoMove")[0].checked;
            mylets.delay = $("#timeDelay")[0].value;
            mylets.isThinking = isThinking;
            myFunctions.spinner();
            if ($("chess-board")[0].game.getTurn() == $("chess-board")[0].game.getPlayingAs()) myTurn = true; else myTurn = false;
        } else
            myFunctions.loadEx();

        if (!engine.engine)
            myFunctions.loadChessEngine();

        if (mylets.autoRun == true && canGo == true && isThinking == false && myTurn) {
            console.log(`going: ${canGo} ${isThinking} ${myTurn}`);
            canGo = false;
            const currentDelay = mylets.delay != undefined ? mylets.delay * 1000 : 10;
            other(currentDelay);
        }
    }, 100);
}

window.addEventListener("load", () => {
    main();
});
