from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import base64
from dotenv import load_dotenv
import os
import cohere
import json
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from string import Template

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cohere = cohere.Client(COHERE_API_KEY)


# models
class ContentType(str, Enum):
    WEB_LINK = "WEB_LINK"
    PLAIN_TEXT = "PLAIN_TEXT"
    TXT_DOC_LINK = "TXT_DOC_LINK"
    PDF_LINK = "PDF_LINK"


class GenerateTopicsDto(BaseModel):
    content: str
    count: int
    content_type: ContentType


class GenerateMcqQuestionsDto(BaseModel):
    text: str
    topics: List[str]
    count: int


# utils
def decode_base64(data: str) -> str:
    return base64.b64decode(data).decode("utf-8")


# services
def generate_topics_from_text(text: str, count: int):
    response = cohere.chat(
        message=f"""
    ## Instruction
    Generate {count} high level topics from the give input text that are meaningful and captures the essence of the entire text.

    The response should be in the format which will looks something like this:
    {{
    "topics": [
        "topic-1",
        "topic-2",
        "topic-3"
    ]
    }}
    
    ## Input text
    {text}
    """,
        model="command-r-plus",
    )

    response = response.text

    # check if the response has a sub text
    if "```json" in response:
        # replace the json code block with empty string
        response = response.replace("```json", "").replace("```", "")

    return response


def generate_mcq_questions(text: str, count: int, topics: List[str]):

    template = Template(
        """
    ## Instruction
    Generate $count multiple choice questions from the given input text on the topics $topics. Make sure these **questions strictly belongs to only the listed topics**, no other topics should be included.

    The number of options should vary between 3 to 8.
    The correct answer should be one of the options.

    The response should be **strictly** in the json format which will looks something like this:
    ```json
    {
    "questions": [
        {
        "id": 1,
        "question": "question content here",
        "options": [
            {
            "id": 1,
            "option": "option content here"
            },
            {
            "id": 2,
            "option": "option content here"
            },
            {
            "id": 3,
            "option": "option content here"
            },
            {
            "id": 4,
            "option": "option content here"
            },
            {
            "id": 5,
            "option": "option content here"
            }
        ],
        "correct_option_id": 4
        },
        {
        "id": 2,
        "question": "question content here",
        "options": [
            {
            "id": 1,
            "option": "option content here"
            },
            {
            "id": 2,
            "option": "option content here"
            },
            {
            "id": 3,
            "option": "option content here"
            },
            {
            "id": 4,
            "option": "option content here"
            },
            {
            "id": 5,
            "option": "option content here"
            }
        ],
        "correct_option_id": 4
        }
    ]
    }
    ```
    
    ## Input text
    $text
    """
    )

    prompt = template.substitute(count=count, topics=", ".join(topics), text=text)

    response = cohere.chat(
        message=prompt,
        model="command-r-plus",
    )

    response = response.text

    # check if the response has a sub text
    if "```json" in response:
        # replace the json code block with empty string
        response = response.replace("```json", "").replace("```", "")

    return response


# route handlers
@app.get("/")
def read_root():
    return {"message": "Hello World!"}


@app.post("/generate_topics")
def generate_topics_handler(dto: GenerateTopicsDto):
    print(
        f"{generate_topics_handler.__name__} called with content_type [{dto.content_type}] and count [{dto.count}]"
    )
    if (
        dto.content_type != ContentType.PLAIN_TEXT
        and dto.content_type != ContentType.WEB_LINK
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type, it should be either {ContentType.PLAIN_TEXT} or {ContentType.WEB_LINK}",
        )

    topics = generate_topics_from_text(decode_base64(dto.content), dto.count)
    topics = json.loads(topics)["topics"]

    return {"topics": topics}


@app.post("/generate_mcq_questions")
def generate_mcq_questions_handler(dto: GenerateMcqQuestionsDto):
    print(
        f"{generate_mcq_questions_handler.__name__} called with topics [{', '.join(dto.topics)}] and count [{dto.count}]"
    )
    questions = generate_mcq_questions(decode_base64(dto.text), dto.count, dto.topics)
    questions = json.loads(questions)["questions"]

    return {"questions": questions}
