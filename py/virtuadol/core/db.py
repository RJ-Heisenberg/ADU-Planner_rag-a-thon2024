import os

from llama_index import vector_stores


_EMBEDDINGS_COLLECTION = os.getenv("VECTOR_STORE_COLLECTION", "embeddings")


class Database:
    @classmethod
    @property
    def vector_store(cls):
        if not hasattr(cls, "__vector_store"):
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
