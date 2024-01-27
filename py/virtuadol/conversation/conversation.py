from . import message

from llama_index.vector_stores.types import VectorStore

from typing import List


ConversationId = int
Message = message.Message
MessageSubscriber = message.MessageSubscriber


class Conversation:
    _id: ConversationId
    _messages: List[Message]
    _message_subscribers: List[MessageSubscriber]

    def __init__(self, id: ConversationId) -> None:
        self._id = id
        self._messages = _find_messages(id)
        self._message_subscribers = []

    def append(self, msg: Message) -> None:
        self._messages.append(msg)

        keep = []
        for i, message_subscriber in enumerate(self._message_subscribers):
            if message_subscriber(msg):
                keep.append(i)

        # Remove the subscribers that didn't specify 'keep'
        if len(keep) < len(self._message_subscribers):
            self._message_subscribers = [self._message_subscribers[i] for i in keep]

    def subscribe(self, message_subscriber: MessageSubscriber) -> None:
        self._message_subscribers.append(message_subscriber)


def _find_messages(id: ConversationId) -> List[Message]:
    return []  # This should be a database query
