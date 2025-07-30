from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5175",  # adresse locale React
    "http://127.0.0.1:5175",  # parfois React utilise cette IP locale
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins ,  # liste des domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],  # autorise tous les types de méthodes (GET, POST, PUT, DELETE, ...)
    allow_headers=["*"],  # autorise tous les headers
)

@app.get("/api")
def root():
    return {"hello": "world"}