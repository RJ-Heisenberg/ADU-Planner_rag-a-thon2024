const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
    path: "./config.env"
});

const port = process.env.PORT;
if (port === undefined) {
    throw "No port specified, please update your config.env!";
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});