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
        return signup_resp(False, False)
    elif(check_pwnedpasswords(password)):
        return signup_resp(True, False)
    elif(check_sequential_passwords(password)):
        return signup_resp(True, False)
    else:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        database[username] = [hash, salt, 10]

        return signup_resp(True, True)

@app.post("/login")
async def login(data: Params):
    username = data.username
    password = data.password

    if username in database:
        if bcrypt.hashpw(password.encode('utf-8'), database[username][1]) == database[username][0]:
            database[username][2] = 10
            return login_resp(True, True, -1)

        else:
            database[username][2] -= 1
            if database[username][2] == 0:
                del database[username]
                return login_resp(False, True, 0)

            return login_resp(False, True, database[username][2])
    else:
        return login_resp(False, False, -1)



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


def check_sequential_passwords(password):
    # Check if password consists of only one char
    char_count = {}
    for char in password:
        char_count[char] = char

    if len(char_count) == 1:
        return True

    # Check if password has sequential numbers
    if not password.isdigit():
        return False

    ascending = all(int(password[i]) == int(password[i-1]) + 1 for i in range(1, len(password)))
    descending = all(int(password[i]) == int(password[i-1]) - 1 for i in range(1, len(password)))

    return ascending or descending


def signup_resp(notUsed, strongPassword):
    return {"notUsed": notUsed,
            "strongPassword": strongPassword}

def login_resp(correctPassword, registered, attempts):
    return {"correctPassword": correctPassword,
            "registered": registered,
            "attempts": attempts}