import {
    python
} from "pythonia";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
    path: "./config.env"
});

const py = await python("py");
const conversation_lib = py.virtuadol.conversation

const port = process.env.PORT;
if (port === undefined) {
    throw "No port specified, please update your config.env!";
}

const app = express();

app.use(cors());
app.use(express.json());

// start a new conversation; respond with its id
app.post('/conversation', async (_, res) => {
    const conversation = await conversation_lib.get_cached(null);
    const conversation_id = await conversation.id;
    res.json({
        id: conversation_id
    });
});

// return a list of all a conversation's messages
// TODO(jszaday): implementation pagination for prod
app.get('/conversation/:id', async (req, res) => {
    const conversation_id = req.params.id;
    // TODO(jszaday): make this strict
    const conversation = await conversation_lib.get_cached(conversation_id);
    if (conversation) {
        const message_objs = await conversation.messages;
        const messages = []
        for await (const message of message_objs) {
            messages.push({
                sender: await message.sender,
                body: await message.body
            });
        }
        res.json(messages);
    } else {
        res.json([]);
    }
});

// send a message
app.post('/conversation/:id', async (req, res) => {
    const conversation_id = req.params.id;
    const message_body = req.body.body;
    // TODO(jszaday): make this strict
    const conversation = await conversation_lib.get_cached(conversation_id);
    conversation.send('<me>', message_body).then(() => res.json({}));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});