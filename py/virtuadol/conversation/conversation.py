from . import message

from typing import List, TypedDict
from ..core.db import Collection, Database, ObjectId


ConversationId = ObjectId
Message = message.Message
MessageSubscriber = message.MessageSubscriber


class Conversation:
    _id: ConversationId
    _messages: List[Message]

    def __init__(self, id: ConversationId) -> None:
        self._id = id
        self._messages = _find_messages(id)
        self._message_subscribers = []

    @property
    def id(self) -> ConversationId:
        return self._id

    @property
    def id_str(self) -> str:
        return str(self._id)

    @property
    def messages(self) -> List[Message]:
        return self._messages

    def send(self, sender: str, body: str) -> None:
        self.append({"sender": sender, "body": body})

    def append(self, msg: Message) -> None:
        # TODO(jszaday): this may be redundant...?
        _store_message(self._id, msg)
        self._messages.append(msg)

        keep = []
        for i, (on_message_fn, _) in enumerate(self._message_subscribers):
            if on_message_fn(msg["sender"], str(msg["body"])):
                keep.append(i)

        # Remove the subscribers that didn't specify 'keep'
        if len(keep) < len(self._message_subscribers):
            self._message_subscribers = [self._message_subscribers[i] for i in keep]

        for _, on_all_notified_fn in self._message_subscribers:
            on_all_notified_fn()

    def subscribe(self, message_subscriber: MessageSubscriber) -> None:
        # js/py bridge will misbehave if we don't cache these
        on_message_fn = message_subscriber.on_message
        on_all_notified_fn = message_subscriber.on_all_notified
        assert on_message_fn is not None
        self._message_subscribers.append((on_message_fn, on_all_notified_fn))


class _ConversationDocument(TypedDict):
    _id: ConversationId
    messages: List[Message]


def _find_messages(id: ConversationId) -> List[Message]:
    conversations: Collection[_ConversationDocument] = Database.collection(
        "conversations"
    )
    conversation = conversations.find_one({"_id": id})
    return conversation["messages"] if conversation else []


def _store_message(id: ConversationId, msg: Message):
    conversations: Collection[_ConversationDocument] = Database.collection(
        "conversations"
    )
    conversations.update_one({"_id": id}, {"$push": {"messages": msg}}, upsert=True)
