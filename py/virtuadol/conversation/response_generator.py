from . import conversation as conversation_lib
from . import cache as cache_lib
from . import message

import os

from llama_index.chat_engine.types import BaseChatEngine
from llama_index import memory as memory_lib

from ..core.db import Database

from typing import Optional

ConversationId = conversation_lib.ConversationId
Message = message.Message
MessageSubscriber = message.MessageSubscriber

MOCK_RESPONSE = os.getenv("MOCK_RESPONSE", "False") == "True"


class ResponseGenerator(MessageSubscriber):
    _conversation_id: ConversationId
    _name: str = "<system>"
    _chat_engine: Optional[BaseChatEngine] = None

    def __init__(self, conversation_id: ConversationId):
        self._conversation_id = conversation_id
        self._backlog = []

    @property
    def chat_engine(self) -> BaseChatEngine:
        if self._chat_engine is None:
            # TODO(jszaday): load conversation history.
            memory = memory_lib.ChatMemoryBuffer.from_defaults(token_limit=3900)
            self._chat_engine = Database.index.as_chat_engine(
                chat_mode="condense_plus_context",
                memory=memory,
                verbose=True,
            )
        return self._chat_engine

    def on_all_notified(self):
        backlog, self._backlog = self._backlog, []
        for msg in backlog:
            conversation = cache_lib.get_cached(self._conversation_id)
            if MOCK_RESPONSE:
                conversation.send(self._name, msg)
            else:
                conversation.send(self._name, self.chat_engine.chat(msg))

    def on_message(self, sender, body) -> bool:
        if self._name != sender:
            self._backlog.append(body)

        return True
