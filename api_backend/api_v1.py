from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import requests
import hashlib


app = FastAPI()

database = {}

origins = [
    "http://127.0.0.1:4200",
    "http://localhost:4200",
    "https://www.sswem.de"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Params(BaseModel):
    username: str
    password: str


@app.post("/signup")
async def signup(data: Params):
    username = data.username
    password = data.password

    if username in database:
        return {"notUsed": False,
                "strongPassword": False}
    elif(check_pwnedpasswords(password)):
        return {"notUsed": True,
                "strongPassword": False}
    else:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        database[username] = [hash, salt]

        return {"notUsed": True,
                "strongPassword": True}

@app.post("/login")
async def login(data: Params):
    username = data.username
    password = data.password

    if username in database:
        if bcrypt.hashpw(password.encode('utf-8'), database[username][1]) == database[username][0]:
            print("success")
            return {"correctPassword": True,
                    "registered": True}

        else:
            return {"correctPassword": False,
                    "registered": True}
    else:
        return {"correctPassword": False,
                "registered": False}


def check_pwnedpasswords(password):
    hashed_password = hashlib.sha1(password.encode('utf-8')).hexdigest()

    prefix = hashed_password[:5]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    response = requests.get(url)

    for line in response.text.splitlines():
        hash_suffix, count = line.split(':')
        if hash_suffix.upper() == hashed_password[5:].upper():
            return True
    else:
        return False