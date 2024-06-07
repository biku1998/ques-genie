from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import cohere
import json
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from string import Template
from typing import List, Literal, TypedDict
from utils import decode_base64, get_word_count
from prompts import prompts

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


# models and types


class Topic(TypedDict):
    id: int
    text: str


QuestionType = Literal["mcq", "checkbox"]
QuestionLevel = Literal["easy", "medium", "hard"]


class Option(TypedDict):
    id: int
    text: str


class QuestionBase(TypedDict):
    id: int
    text: str
    topic: Topic
    options: List[Option]
    level: QuestionLevel


class McqQuestion(QuestionBase):
    type: Literal["mcq"]
    correctOptionId: int


class CheckboxQuestion(QuestionBase):
    type: Literal["checkbox"]
    correctOptionIds: List[int]


Question = McqQuestion | CheckboxQuestion


class QuestionConfig(TypedDict):
    topic: Topic
    count: int
    level: QuestionLevel
    type: QuestionType


class GenerateTopicsDto(BaseModel):
    text: str
    count: int


class GenerateQuestionsDto(BaseModel):
    text: str
    configs: List[QuestionConfig]


# services
def generate_topics(text: str, count: int):
    print(
        f"[{generate_topics.__name__}] called with text that has length [{get_word_count(text)}] and topic count [{count}]"
    )

    response = cohere.chat(
        message=prompts["generate_topics"].substitute(text=text, count=count),
        model="command-r-plus",
    )
    responseText = response.text

    # check if the response has json sub text
    if "```json" in responseText:
        # replace the json code block with empty string
        responseText = responseText.replace("```json", "").replace("```", "")

    return responseText


def generate_mcq_questions(text: str, count: int, topics: List[Topic]):

    prompt = prompts["generate_mcq_questions"].substitute(
        text=text, count=count, topics=topics
    )

    response = cohere.chat(
        message=prompt,
        model="command-r-plus",
    )

    responseText = response.text

    # check if the response has a sub text
    if "```json" in responseText:
        # replace the json code block with empty string
        responseText = responseText.replace("```json", "").replace("```", "")

    return responseText


# route handlers
@app.get("/")
def read_root():
    return {"message": "Hello World!"}


@app.post("/generate_topics")
def generate_topics_handler(dto: GenerateTopicsDto):
    dto.text = decode_base64(dto.text)
    print(
        f"[{generate_topics_handler.__name__}] called with text that has length [{get_word_count(dto.text)}] and topic count [{dto.count}]"
    )

    # TODO: remove this
    # return {
    #     "data": [
    #         {"id": 1, "text": "RESTful API Design"},
    #         {"id": 2, "text": "Gmail Design Refresh"},
    #         {"id": 3, "text": "API Versioning"},
    #         {"id": 4, "text": "SSL and Security"},
    #         {"id": 5, "text": "API Documentation"},
    #         {"id": 6, "text": "Filtering, Sorting and Searching"},
    #         {"id": 7, "text": "Field Selection and Embedding"},
    #         {"id": 8, "text": "Pretty Printing and Gzip Compression"},
    #         {"id": 9, "text": "Error Handling and Status Codes"},
    #         {"id": 10, "text": "Rate Limiting and Caching"},
    #     ]
    # }

    topics = generate_topics(dto.text, dto.count)
    topics = json.loads(topics)["topics"]

    if len(topics) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Topic generation failed",
        )

    data = [{"id": idx + 1, "text": topic} for idx, topic in enumerate(topics)]

    return {"data": data}


@app.post("/generate_questions")
def generate_questions_handler(dto: GenerateQuestionsDto):
    dto.text = decode_base64(dto.text)
    print(
        f"{generate_questions_handler.__name__} called with text that has length [{get_word_count(dto.text)}] and configs [{dto.configs}]"
    )

    # return {
    #     "data": [
    #         {
    #             "id": 1,
    #             "type": "mcq",
    #             "topic": {"id": 1, "text": "RESTful API Design"},
    #             "text": "Which of the following is NOT a recommended practice for designing a RESTful API?",
    #             "options": [
    #                 {"id": 1, "text": "Use RESTful URLs and actions"},
    #                 {"id": 2, "text": "Use SSL for all API requests"},
    #                 {"id": 3, "text": "Include an envelope for all API responses"},
    #                 {
    #                     "id": 4,
    #                     "text": "Provide clear and easily accessible documentation",
    #                 },
    #                 {"id": 5, "text": "Version the API to allow for iterative changes"},
    #             ],
    #             "correct_option_id": 3,
    #         },
    #         {
    #             "id": 2,
    #             "type": "mcq",
    #             "topic": {"id": 1, "text": "RESTful API Design"},
    #             "text": "What is the recommended way to handle pagination in a RESTful API?",
    #             "options": [
    #                 {
    #                     "id": 1,
    #                     "text": "Use a query parameter to specify the page number",
    #                 },
    #                 {
    #                     "id": 2,
    #                     "text": "Include pagination links in the response headers",
    #                 },
    #                 {
    #                     "id": 3,
    #                     "text": "Use a custom header to indicate the total number of pages",
    #                 },
    #                 {"id": 4, "text": "Return a fixed number of results per request"},
    #                 {
    #                     "id": 5,
    #                     "text": "Use a combination of Link header and custom X-Total-Count header",
    #                 },
    #             ],
    #             "correct_option_id": 5,
    #         },
    #         {
    #             "id": 3,
    #             "type": "mcq",
    #             "topic": {"id": 1, "text": "RESTful API Design"},
    #             "text": "What is the recommended way to handle authentication in a RESTful API?",
    #             "options": [
    #                 {"id": 1, "text": "Use OAuth 2.0 for all authentication requests"},
    #                 {
    #                     "id": 2,
    #                     "text": "Use HTTP Basic Auth with randomly generated access tokens",
    #                 },
    #                 {
    #                     "id": 3,
    #                     "text": "Include authentication credentials in the request headers",
    #                 },
    #                 {
    #                     "id": 4,
    #                     "text": "Use a combination of OAuth 2.0 and access tokens for different use cases",
    #                 },
    #                 {"id": 5, "text": "Use session-based authentication with cookies"},
    #             ],
    #             "correct_option_id": 4,
    #         },
    #         {
    #             "id": 4,
    #             "type": "mcq",
    #             "topic": {"id": 1, "text": "RESTful API Design"},
    #             "text": "Which data format is recommended for API responses?",
    #             "options": [
    #                 {"id": 1, "text": "XML"},
    #                 {"id": 2, "text": "JSON"},
    #                 {"id": 3, "text": "CSV"},
    #                 {"id": 4, "text": "HTML"},
    #                 {"id": 5, "text": "YAML"},
    #             ],
    #             "correct_option_id": 2,
    #         },
    #     ]
    # }

    questions = []

    mcq_question_configs = list(
        filter(lambda config: config["type"] == "mcq", dto.configs)
    )

    if len(mcq_question_configs) > 0:
        mcq_question_topics = list(
            map(
                lambda config: {
                    "id": config["topic"]["id"],
                    "text": config["topic"]["text"],
                    "question_count": config["count"],
                },
                mcq_question_configs,
            )
        )
        mcq_question_count = sum(
            map(lambda config: config["count"], mcq_question_configs)
        )

        mcq_questions = json.loads(
            generate_mcq_questions(dto.text, mcq_question_count, mcq_question_topics)
        )["questions"]

        questions.extend(mcq_questions)

    return {"data": questions}
