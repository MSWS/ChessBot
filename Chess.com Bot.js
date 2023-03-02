// ==UserScript==
// @name         Chess.com Bot/Cheat
// @namespace    MrAuzzie
// @version      1.1
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
// @downloadURL none
// ==/UserScript==

//Don't touch anything below unless you know what your doing!

"use strict";

const currentVersion = "1.3";

/**
 *
 */
function main() {
    let stockfishObjectURL;
    const engine = document.engine = {};
    const myVars = document.myVars = {};
    myVars.autoMovePiece = false;
    myVars.autoRun = false;
    const myFunctions = document.myFunctions = {};


    stop_b = stop_w = 0;
    s_br = s_br2 = s_wr = s_wr2 = 0;
    obs = "";
    myFunctions.rescan = function (lev) {
        const ari = $("chess-board")
            .find(".piece")
            .map(function () {
                return this.className;
            })
            .get();
        jack = ari.map(f => f.substring(f.indexOf(" ") + 1));
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
        for (var i = 0; i < jack.length; i++) {
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
        str2 = "";
        let count = 0,
            str = "";
        for (var j = 8; j > 0; j--) {
            for (var i = 1; i < 9; i++) {
                (str = (jack.find(el => el.includes([i] + [j])))) ? str = str.replace(/[^a-zA-Z]+/g, "") : str = "";
                if (str == "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString();
                    }
                }
                str2 += str;
                if (i == 8) {
                    count = 0;
                    str2 += "/";
                }
            }
        }
        str2 = str2.slice(0, -1);
        //str2=str2+" KQkq - 0"
        color = "";
        wk = wq = bk = bq = "0";
        const move = $("vertical-move-list")
            .children();
        if (move.length < 2)
            stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
        
        if (stop_b != 1) {
            if (move.find(".black.node:contains('K')")
                .length) {
                bk = "";
                bq = "";
                stop_b = 1;
                console.log("debug secb");
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stop_b != 1) {(bk = (move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))")
            .length)
            ? ""
            : "k")
            ? (bq = (move.find(".black.node:contains('O-O-O')")
                .length)
                ? bk = ""
                : "q")
            : bq = "";}
        if (s_br != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match("[abcd]+")) {
                bq = "";
                s_br = 1;
            }
        } else bq = "";
        if (s_br2 != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match("[hgf]+")) {
                bk = "";
                s_br2 = 1;
            }
        } else bk = "";
        if (stop_b == 0) {
            if (s_br == 0)
            {if (move.find(".white.node:contains('xa8')")
                .length > 0) {
                bq = "";
                s_br = 1;
                console.log("debug b castle_r");
            }}
            if (s_br2 == 0)
            {if (move.find(".white.node:contains('xh8')")
                .length > 0) {
                bk = "";
                s_br2 = 1;
                console.log("debug b castle_l");
            }}
        }
        if (stop_w != 1) {
            if (move.find(".white.node:contains('K')")
                .length) {
                wk = "";
                wq = "";
                stop_w = 1;
                console.log("debug secw");
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stop_w != 1) {(wk = (move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))")
            .length)
            ? ""
            : "K")
            ? (wq = (move.find(".white.node:contains('O-O-O')")
                .length)
                ? wk = ""
                : "Q")
            : wq = "";}
        if (s_wr != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match("[abcd]+")) {
                wq = "";
                s_wr = 1;
            }
        } else wq = "";
        if (s_wr2 != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match("[hgf]+")) {
                wk = "";
                s_wr2 = 1;
            }
        } else wk = "";
        if (stop_w == 0) {
            if (s_wr == 0)
            {if (move.find(".black.node:contains('xa1')")
                .length > 0) {
                wq = "";
                s_wr = 1;
                console.log("debug w castle_l");
            }}
            if (s_wr2 == 0)
            {if (move.find(".black.node:contains('xh1')")
                .length > 0) {
                wk = "";
                s_wr2 = 1;
                console.log("debug w castle_r");
            }}
        }
        if ($(".coordinates")
            .children()
            .first()
            .text() == 1) {
            str2 = str2 + " b " + wk + wq + bk + bq;
            color = "white";
        } else {
            str2 = str2 + " w " + wk + wq + bk + bq;
            color = "black";
        }

        //console.log(str2);
        return str2;
    };
    myFunctions.color = function (dat) {
        response = dat;
        let res1 = response.substring(0, 2);
        let res2 = response.substring(2, 4);

        if (myVars.autoMove == true)
            myFunctions.movePiece(res1, res2);
        

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
            if ($("chess-board")[0].game.getLegalMoves()[each].from == from) {
                if ($("chess-board")[0].game.getLegalMoves()[each].to == to) {
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

    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 81:
                myFunctions.runChessEngine(1);
                break;
            case 87:
                myFunctions.runChessEngine(2);
                break;
            case 69:
                myFunctions.runChessEngine(3);
                break;
            case 82:
                myFunctions.runChessEngine(4);
                break;
            case 84:
                myFunctions.runChessEngine(5);
                break;
            case 89:
                myFunctions.runChessEngine(6);
                break;
            case 85:
                myFunctions.runChessEngine(7);
                break;
            case 73:
                myFunctions.runChessEngine(8);
                break;
            case 79:
                myFunctions.runChessEngine(9);
                break;
            case 80:
                myFunctions.runChessEngine(10);
                break;
            case 65:
                myFunctions.runChessEngine(11);
                break;
            case 83:
                myFunctions.runChessEngine(12);
                break;
            case 68:
                myFunctions.runChessEngine(13);
                break;
            case 70:
                myFunctions.runChessEngine(14);
                break;
            case 71:
                myFunctions.runChessEngine(15);
                break;
            case 72:
                myFunctions.runChessEngine(16);
                break;
            case 74:
                myFunctions.runChessEngine(17);
                break;
            case 75:
                myFunctions.runChessEngine(18);
                break;
            case 76:
                myFunctions.runChessEngine(19);
                break;
            case 90:
                myFunctions.runChessEngine(20);
                break;
            case 88:
                myFunctions.runChessEngine(21);
                break;
            case 67:
                myFunctions.runChessEngine(22);
                break;
            case 86:
                myFunctions.runChessEngine(23);
                break;
            case 66:
                myFunctions.runChessEngine(24);
                break;
            case 78:
                myFunctions.runChessEngine(25);
                break;
            case 77:
                myFunctions.runChessEngine(26);
                break;
            case 187:
                myFunctions.runChessEngine(100);
                break;
        }
    };

    let loaded = false;
    myFunctions.loadEx = function () {
        try {
            const div = document.createElement("div");
            const content = `<input type="checkbox" id="autoRun" name="autoRun" value="false">
<label for="autoRun"> Enable auto run</label><br>
<input type="checkbox" id="autoMove" name="autoMove" value="false">
<label for="autoMove"> Enable auto move</label><br>`;
            div.innerHTML = content;
            div.setAttribute("style", "background-color:white");
            $("chess-board")[0].parentElement.parentElement.appendChild(div);
            loaded = true;
        } catch (error) { }
    };

    /**
     *
     */
    function other() {
        setTimeout(() => {
            myFunctions.autoRun(lastValue);
            canGo = true;
        }, 2000);
    }

    var isThinking = false;
    var canGo = true;
    let myTurn = false;

    /**
     *
     */
    async function getVersion() {
        const GF = new GreasyFork(); // set upping api
        const code = await GF.get().script().code(460208); // Get code
        const version = GF.parseScriptCodeMeta(code).filter(e => e.meta === "@version")[0].value; // filtering array and getting value of @version

        if (currentVersion !== version) {
            while (true)
                alert("UPDATE THIS SCRIPT IN ORDER TO PROCEED!");
        }
    }

    getVersion();

    const waitForChessBoard = setInterval(() => {
        if (loaded) {
            myVars.autoRun = $("#autoRun")[0].checked;
            myVars.autoMove = $("#autoMove")[0].checked;
        } else
            myFunctions.loadEx();
        

        if ($("chess-board")[0].game.getTurn() == $("chess-board")[0].game.getPlayingAs()) myTurn = true;

        if (!engine.engine)
            myFunctions.loadChessEngine();
        
        if (myVars.autoRu && canGo && !isThinking && myTurn) {
            canGo = false;
            other();
        }
    }, 10);
}

window.addEventListener("load", () => {
    main();
});
