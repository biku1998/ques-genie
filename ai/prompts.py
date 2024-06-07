from string import Template

prompts = {
    "generate_topics": Template(
        """
    ## Instruction
    Generate $count high-level topics from the given input text that are meaningful. These topics should be the main themes of the text.

    The response should be a json in the below **strict** format:
    ```json
    {
    "topics": [
        "topic-1",
        "topic-2",
        "topic-3"
    ]
    }
    ```

    ## Input text
    $text
    """
    ),
    "generate_mcq_questions": Template(
        """
    ## Instruction
    Generate $count multiple choice questions from the given input text on the give input topics. Make sure these **questions strictly belongs to only the provided topics**, no other topics should be included.

    **The question count to create for each topic is present in the topics**

    - The topics will be in the below format:
    [
        {
            "id": 1,
            "text": "RESTful API Design",
            "question_count": 3
        },
        {
            "id": 2,
            "text": "Gmail Design Refresh"
            "question_count": 2
        }
    ]

    Here text is the actual topic and id is the unique identifier for the topic.

    - The number of options should vary between 3 to 5.
    - The correct answer should be one of the options.
    - The questions should be meaningful and should not be too easy or too difficult.
    - All the question payload should have topic payload to denote which topic the question belongs to.
    - The response should be **strictly** in the json format which will looks something like this:
    ```json
    {
    "questions": [
        {
        "id": 1,
        "topic": {
            "id": 1,
            "text": "RESTful API Design"
        },
        "type": "mcq",
        "level": "medium",
        "text": "question content here",
        "options": [
            {
            "id": 1,
            "text": "option content here"
            },
            {
            "id": 2,
            "text": "option content here"
            },
            {
            "id": 3,
            "text": "option content here"
            },
            {
            "id": 4,
            "text": "option content here"
            },
            {
            "id": 5,
            "text": "option content here"
            }
        ],
        "correct_option_id": 4
        },
        {
        "id": 2,
        "topic": {
            "id": 2,
            "text": "Gmail Design Refresh"
        },
        "type": "mcq",
        "level": "medium",
        "text": "question content here",
        "options": [
            {
            "id": 1,
            "text": "option content here"
            },
            {
            "id": 2,
            "text": "option content here"
            },
            {
            "id": 3,
            "text": "option content here"
            },
            {
            "id": 4,
            "text": "option content here"
            },
            {
            "id": 5,
            "text": "option content here"
            }
        ],
        "correct_option_id": 4
        }
    ]
    }
    ```
    ## Topics payload
    $topics
    
    ## Input text
    $text
    """
    ),
}
