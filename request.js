const {io} =  require("socket.io-client");

// your JWT token (normally from login response)
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic2hvbWFsaWsiLCJpYXQiOjE3NTg4Mjc5MjQsImV4cCI6MTc1OTQzMjcyNH0.FhUd2zimzDDiekiQ66c6RrFpYPUL7tzECQ4-xOAuPZU";
// connect to your gateway with JWT in auth
const socket = io("http://localhost:3000", {
    auth: {
        token: token,
    },
});

// on successful connection
socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    // send traffic data
    socket.emit("traffic-data", { // bu joyda traffic-data degan event sodir bo'ladi, bu requestga teng ya'ni shu event orqali request jo'natiladi
        device_id: 2,
        in_count: 0,
        out_count: 0,
    });
});

// listen for server response when data is saved
socket.on("traffic-data-saved", (msg) => {
    console.log("✅ Traffic data saved:", msg);
});

// listen for global traffic updates
socket.on("traffic-update", (update) => {
    console.log("📡 Traffic update:", update);
});

// handle errors
socket.on("error", (err) => {
    console.error("❌ Error:", err);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
