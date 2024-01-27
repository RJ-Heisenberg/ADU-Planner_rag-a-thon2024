from . import conversation as conversation_lib
from . import response_generator

from typing import Dict, Optional

Conversation = conversation_lib.Conversation
ConversationId = conversation_lib.ConversationId
ConversationDict = Dict[ConversationId, Conversation]
ResponseGenerator = response_generator.ResponseGenerator


class Cache:
    _active: ConversationDict
    _last_used_id: ConversationId

    def __init__(self):
        self._active = {}
        self._last_used_id = -1

    # TODO(jszaday) : implement this with intelligence
    def _fresh_id(self) -> ConversationId:
        self._last_used_id += 1
        return self._last_used_id

    def __getitem__(self, id: Optional[ConversationId]) -> Conversation:
        if id is None:
            id = self._fresh_id()
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


def get_cached(id: Optional[ConversationId]) -> Conversation:
    return (get_cache())[id]
