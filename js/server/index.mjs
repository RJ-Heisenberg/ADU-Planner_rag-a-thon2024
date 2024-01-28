import {
    python,
    PyClass
} from "pythonia";
import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import dotenv from "dotenv";
import {
    join
} from "node:path";

import path from 'path';
import {
    fileURLToPath
} from 'url';
import {
    v4 as uuidv4
} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: join(__dirname, "config.env")
});

const py = await python("py");
const conversation_lib = py.virtuadol.conversation
const MessageSubscriber = await conversation_lib.MessageSubscriber

const clients = new Map();

class WebSocketSubscriber extends PyClass {
    constructor(id) {
        super(MessageSubscriber, [id])
    }

    async on_message(sender, body) {
        const id = await this._id;
        const socket = clients.get(id);
        if (socket === undefined) {
            return false;
        }
        socket.send(JSON.stringify({
            sender: sender,
            body: body
        }));
        return true;
    }
}

const port = process.env.PORT;
if (port === undefined) {
    throw "No port specified, please update your config.env!";
}

const {
    app
} = expressWs(express());

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

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

app.ws('/conversation/:id', async (ws, req) => {
    const conversation_id = req.params.id;
    const conversation = await conversation_lib.get_cached(conversation_id);
    const clientId = uuidv4().toString();
    clients.set(clientId, ws);

    const subscriber = await WebSocketSubscriber.init(clientId);
    await conversation.subscribe(subscriber);

    ws.on('message', message => {
        conversation.send('<me>', message);
    });

    ws.on('close', () => {
        clients.delete(clientId);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});