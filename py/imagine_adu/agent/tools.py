import chromadb
import hashlib
import os

from geopy.geocoders import Nominatim
from llama_index import VectorStoreIndex
from llama_index.storage.storage_context import StorageContext
from llama_index.vector_stores import ChromaVectorStore
from llama_parse import LlamaParse
from typing import List

from . import constants


CrawlerResult = str

_DOCUMENTS_PATH = os.environ['DOCUMENTS_DIR']
_CRAWLER_RESULTS = {}
_DOCUMENTS_CACHE = {}
_FILES = {}
_GEOLOCATOR = Nominatim(user_agent=constants.AGENT_NAME)
_HARDCODED_CRAWLER_RESULTS = {}
_HARDCODED_CRAWLER_RESULTS["Saratoga, California"] = _HARDCODED_CRAWLER_RESULTS[
    "Saratoga, CA"
] = [os.path.join(_DOCUMENTS_PATH, doc) for doc in [
    "ADU and JADU Handout.pdf",
    "ADU_FAQ.pdf",
    "ADU_Handbook.pdf",
    "SCC-ADU-Guidebook-FINAL-9.8.23.pdf",
]]
_PARSER = LlamaParse(result_type="markdown")


def extract_city_state_pair_from_address(address: str) -> str:
    location = _GEOLOCATOR.geocode(address, addressdetails=True)
    address = location.raw["address"]
    if "city" in address:
        city = address["city"]
    elif "town" in address:
        city = address["town"]
    else:
        raise ValueError(f"Unsure what to look for in {address}")
    state = location.raw["address"]["state"]
    return f"{city}, {state}"


def get_building_codes_digest_for_city_state_pair(pair: str) -> CrawlerResult:
    # TODO: Query the internet to find these documents
    if pair not in _HARDCODED_CRAWLER_RESULTS:
        raise ValueError(f"Unrecognized location, {pair}")
    results = _HARDCODED_CRAWLER_RESULTS[pair]
    key = hashlib.md5(pair.encode()).hexdigest()  # TODO: canonicalize
    _CRAWLER_RESULTS[key] = results
    return key


def read_documents(file: str) -> List[str]:
    if file in _FILES:
        return _FILES[file]
    _FILES[file] = _PARSER.load_data(file)
    return _FILES[file]


def ingest_documents(files: List[str]):
    key = ";".join(sorted(files))
    if key in _DOCUMENTS_CACHE:
        return _DOCUMENTS_CACHE[key]

    docs = []
    for file in files:
        docs.extend(read_documents(file))

    chroma_client = chromadb.EphemeralClient()
    chroma_collection = chroma_client.get_or_create_collection("embeddings")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_documents(docs, storage_context=storage_context)
    _DOCUMENTS_CACHE[key] = query_engine = index.as_query_engine()

    return query_engine


def query_building_codes_digest(adu_building_codes: CrawlerResult, query: str) -> str:
    return ingest_documents(_CRAWLER_RESULTS[adu_building_codes]).query(query).response
