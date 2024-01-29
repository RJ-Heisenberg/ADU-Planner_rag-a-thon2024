from typing import Optional, TypedDict

# TODO(jszaday) : use this
MessageId = int


class Message(TypedDict):
    sender: str
    body: str


class MessageSubscriber:
    def __init__(self, id: Optional[str] = None):
        self._id = id

    def on_message(self, sender: str, body: str) -> bool:
        del sender, body
        return False

    def on_all_notified(self):
        pass
