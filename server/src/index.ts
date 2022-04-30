import express from "express";

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.get("/api/data", (req, res) => {
  res.json({ data: "some_data" });
});

app.listen(SERVER_PORT, () => {
  console.log(`server is listening on http://localhost:${SERVER_PORT}`);
});
