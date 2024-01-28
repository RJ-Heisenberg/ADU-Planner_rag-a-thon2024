Set environment variables:
```
$ export PYTHON_BIN="$(which python3)"
$ export OPENAI_API_KEY=<REQUIRED>
$ export VECTOR_STORE="chromadb" <OR> "postgresql://..."
$ export VECTOR_STORE_COLLECTION="embeddings"
```

Install packages:
```
$ npm install
$ python3 -m pip install llama_index
```

One of these packages for database: `vecs`, `chromadb`, or `pymongo`.

Run server:
```
$ npm start
```
