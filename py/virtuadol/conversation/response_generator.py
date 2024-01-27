from . import conversation as conversation_lib
from . import cache as cache_lib
from . import message

from llama_index.chat_engine.types import BaseChatEngine
from llama_index import memory as memory_lib

from ..core.db import Database

from typing import Optional

ConversationId = conversation_lib.ConversationId
Message = message.Message

CONTEXT_PROMPT = (
    "You are a chatbot, able to have normal interactions using "
    "these documents as the basis for your responses:\n"
    "{context_str}"
    "\nInstruction: Use the previous chat history, or the context above, to interact and help the user."
)


class ResponseGenerator:
    _conversation_id: ConversationId
    _name: str = "<system>"
    _chat_engine: Optional[BaseChatEngine] = None

    def __init__(self, conversation_id: ConversationId):
        self._conversation_id = conversation_id

    @property
    def chat_engine(self) -> BaseChatEngine:
        if self._chat_engine is None:
            # TODO(jszaday): load conversation history.
            memory = memory_lib.ChatMemoryBuffer.from_defaults(token_limit=3900)
            self._chat_engine = Database.index.as_chat_engine(
                chat_mode="condense_plus_context",
                memory=memory,
                context_prompt=CONTEXT_PROMPT,
                verbose=True,
            )
        return self._chat_engine

    def __call__(self, msg: Message) -> bool:
        if msg.sender == self._name:
            return True

        conversation = cache_lib.get_cached(self._conversation_id)
        conversation.append(Message(self._name, self.chat_engine.chat(msg.body)))

        return True
