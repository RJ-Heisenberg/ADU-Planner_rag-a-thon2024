import os

from llama_index import vector_stores, VectorStoreIndex
from llama_index import storage as storage_lib
from llama_index.vector_stores.types import VectorStore

from typing import Optional


_EMBEDDINGS_COLLECTION = os.getenv("VECTOR_STORE_COLLECTION", "embeddings")


class Database:
    _index: Optional[VectorStoreIndex] = None
    _vector_store: Optional[VectorStore] = None

    @classmethod
    @property
    def index(cls) -> VectorStoreIndex:
        if cls._index is None:
            vector_store = cls.vector_store
            storage_context = storage_lib.StorageContext.from_defaults(
                vector_store=vector_store
            )
            cls._index = VectorStoreIndex.from_vector_store(
                vector_store, storage_context=storage_context
            )

        return cls._index

    @classmethod
    @property
    def vector_store(cls) -> VectorStore:
        if cls._vector_store is None:
            connection_string = os.getenv("VECTOR_STORE")
            if not connection_string or connection_string == "<required>":
                raise RuntimeError(
                    "Please specify the value of VECTOR_STORE in your config.env"
                )
            if connection_string.startswith("postgresql"):
                cls.__vector_store = vector_stores.SupabaseVectorStore(
                    postgres_connection_string=connection_string,
                    collection_name=_EMBEDDINGS_COLLECTION,
                )
            else:
                raise RuntimeError("Unrecognized vector store type!")

        return cls.__vector_store
