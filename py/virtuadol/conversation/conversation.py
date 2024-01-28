from . import message

from llama_index.vector_stores.types import VectorStore

from typing import List


ConversationId = int
Message = message.Message
MessageSubscriber = message.MessageSubscriber


class Conversation:
    _id: ConversationId
    _messages: List[Message]
    # _message_subscribers: List[MessageSubscriber]

    def __init__(self, id: ConversationId) -> None:
        self._id = id
        self._messages = _find_messages(id)
        self._message_subscribers = []

    @property
    def id(self):
        return self._id

    @property
    def messages(self):
        return self._messages

    def send(self, sender: str, body: str) -> None:
        self.append(Message(sender, body))

    def append(self, msg: Message) -> None:
        self._messages.append(msg)

        keep = []
        for i, (on_message_fn, _) in enumerate(self._message_subscribers):
            if on_message_fn(msg.sender, str(msg.body)):
                keep.append(i)

        # Remove the subscribers that didn't specify 'keep'
        if len(keep) < len(self._message_subscribers):
            self._message_subscribers = [self._message_subscribers[i] for i in keep]

        for _, on_all_notified_fn in self._message_subscribers:
            on_all_notified_fn()

    def subscribe(self, message_subscriber: MessageSubscriber) -> None:
        on_message_fn = message_subscriber.on_message
        on_all_notified_fn = message_subscriber.on_all_notified
        assert on_message_fn is not None
        self._message_subscribers.append((on_message_fn, on_all_notified_fn))


def _find_messages(id: ConversationId) -> List[Message]:
    return []  # This should be a database query
