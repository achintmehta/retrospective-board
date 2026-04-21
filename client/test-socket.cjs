const { io } = require("socket.io-client");
const socket = io("http://localhost:3001");
socket.on("connect", () => {
    socket.emit("create_board", { name: "Test" }, (res) => {
        const boardId = res.board.id;
        socket.emit("join_board", boardId);
        socket.emit("add_column", { boardId, title: "Col1" }, (colRes) => {
            const colId = colRes.column.id;
            socket.emit("add_card", { boardId, columnId: colId, content: "Card1" }, (cardRes) => {
                const cardId = cardRes.card.id;
                socket.on("reply_added", (reply) => {
                    console.log("RECEIVED reply_added:", reply);
                    socket.disconnect();
                });
                socket.emit("add_reply", { boardId, cardId, content: "Reply1" }, (res) => {
                    console.log("add_reply callback:", res);
                    if (!res.ok) socket.disconnect();
                });
            });
        });
    });
});
