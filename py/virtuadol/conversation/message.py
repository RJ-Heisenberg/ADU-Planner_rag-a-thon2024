from typing import Optional

# TODO(jszaday) : use this
MessageId = int


class Message:
    sender: str
    body: str

    def __init__(self, sender: str, body: str):
        self.sender = sender
        self.body = body


class MessageSubscriber:
    def __init__(self, id: Optional[str] = None):
        self._id = id

    def on_message(self, sender: str, body: str) -> bool:
        del sender, body
        return False

    def on_all_notified(self):
        pass
