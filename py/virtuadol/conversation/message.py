from typing import Callable

# TODO(jszaday) : use this
MessageId = int


class Message:
    sender: str
    body: str

    def __init__(self, sender: str, body: str):
        self.sender = sender
        self.body = body


MessageSubscriber = Callable[[Message], bool]
