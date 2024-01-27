from . import conversation as conversation_lib
from . import cache as cache_lib
from . import message


ConversationId = conversation_lib.ConversationId
Message = message.Message


class ResponseGenerator:
    _conversation_id: ConversationId
    _name: str = "<system>"

    def __init__(self, conversation_id: ConversationId):
        self._conversation_id = conversation_id

    def __call__(self, msg: Message) -> bool:
        if msg.sender == self._name:
            return True

        conversation = cache_lib.get_cached(self._conversation_id)
        conversation.append(Message(self._name, f"you said: {msg.body}"))

        return True
