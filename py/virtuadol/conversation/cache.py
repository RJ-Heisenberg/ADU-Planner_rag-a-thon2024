from . import conversation as conversation_lib
from . import response_generator

from typing import Dict, Optional, Union

Conversation = conversation_lib.Conversation
ConversationId = conversation_lib.ConversationId
ConversationDict = Dict[ConversationId, Conversation]
ResponseGenerator = response_generator.ResponseGenerator


class Cache:
    _active: ConversationDict

    def __init__(self):
        self._active = {}

    def __getitem__(self, id: Optional[ConversationId]) -> Conversation:
        if id is None:
            id = ConversationId()
        elif id in self._active:
            return self._active[id]
        conversation = Conversation(id)
        conversation.subscribe(ResponseGenerator(id))
        self._active[id] = conversation
        return self._active[id]


_cache: Optional[Cache] = None


def get_cache() -> Cache:
    global _cache
    if _cache is None:
        _cache = Cache()
    return _cache


def get_cached(id: Optional[Union[str, ConversationId]]) -> Conversation:
    id = ConversationId(id) if isinstance(id, str) else id
    print(id)
    return (get_cache())[id]
