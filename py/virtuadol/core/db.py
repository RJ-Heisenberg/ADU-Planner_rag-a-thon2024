import os
import pymongo

from llama_index import vector_stores, VectorStoreIndex
from llama_index import storage as storage_lib
from llama_index.vector_stores.types import VectorStore

from typing import Optional

try:
    import chromadb
except ImportError:
    chromadb = None


MongoClient = pymongo.MongoClient

_MONGO_DATABASE = os.getenv("MONGO_DATABASE", "primary")
_EMBEDDINGS_COLLECTION = os.getenv("VECTOR_STORE_COLLECTION", "embeddings")


class Database:
    _mongo_client: Optional[MongoClient] = None
    _index: Optional[VectorStoreIndex] = None
    _vector_store: Optional[VectorStore] = None

    @classmethod
    @property
    def mongo_client(cls) -> MongoClient:
        if cls._mongo_client is None:
            cls._mongo_client = MongoClient(os.getenv("MONGO_URI"))
        return cls._mongo_client

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
            mongo_uri = os.getenv("MONGO_URI")
            connection_string = os.getenv("VECTOR_STORE", mongo_uri)
            if not connection_string or connection_string == "<required>":
                raise RuntimeError(
                    "Please specify the value of VECTOR_STORE in your config.env"
                )
            elif connection_string.startswith("chromadb"):
                chroma_client = chromadb.EphemeralClient()
                chroma_collection = chroma_client.create_collection(
                    _EMBEDDINGS_COLLECTION
                )
                cls._vector_store = vector_stores.ChromaVectorStore(
                    chroma_collection=chroma_collection
                )
            elif connection_string.startswith("mongodb+srv"):
                if mongo_uri != connection_string:
                    raise RuntimeError(
                        "If both MONGO_URI and VECTOR_STORE are mongodb+srv connections, they must match!"
                    )
                cls._vector_store = vector_stores.MongoDBAtlasVectorSearch(
                    mongodb_client=cls.mongo_client,
                    db_name=_MONGO_DATABASE,
                    collection_name=_EMBEDDINGS_COLLECTION
                )
            elif connection_string.startswith("postgresql"):
                cls._vector_store = vector_stores.SupabaseVectorStore(
                    postgres_connection_string=connection_string,
                    collection_name=_EMBEDDINGS_COLLECTION,
                )
            else:
                raise RuntimeError("Unrecognized vector store type!")

        return cls._vector_store
