# Quiz Game (API)
> The following is an API created for a quiz game on different topics.

## Table of Contents
- [Quiz Game (API)](#quiz-game-api)
  - [Table of Contents](#table-of-contents)
  - [General Information](#general-information)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Endpoints](#endpoints)
  - [Usage Examples](#usage-examples)
      - [Creating user](#creating-user)
      - [Authenticate user](#authenticate-user)
      - [Sending answer](#sending-answer)
  - [Example responses](#example-responses)
      - [Get current user data](#get-current-user-data)
      - [Get question](#get-question)
  - [Project Status](#project-status)
  - [Room for Improvement](#room-for-improvement)
      - [Room for improvement:](#room-for-improvement-1)
      - [To do:](#to-do)
  - [Important Information](#important-information)
  - [Contact](#contact)


## General Information
The main objective of this project is to provide users with a platform where they can have fun and learn with interesting questions and facts.


## Technologies Used

- TypeScript - v5.1.3
- Express - v4.18.2
- Sequelize - v6.32.0
- Passport - v0.6.0
- SQLite3 - v5.1.6


## Features

- User authentication using Passport
- Creation and management of questions
- Management of answers to questions


## Setup
To set up the local environment, follow these instructions in order:

```bash
# 1. Clone the repository from GitHub
git clone https://github.com/LZJorge/Quiz-API.git

# 2. Enter to generated folder
cd Quiz-API

# 3. Install dependencies
npm install

# 4. Compile TypeScript code
npm run build

# 5. Start the server
npm start
```

## Usage
The API is used through HTTP requests to the available endpoints.

## Endpoints

Below is a table of the available endpoints in this API.

| Method | URL              | Description                                | Request body                            |
| ------ | ---------------- | ------------------------------------------ | --------------------------------------- |
| GET    | /question        | Gives a random question (active a question) | N/A                                     |
| POST, PUT, PATCH    | /question        | Send answer (to user active question)       | `answer`                                |
| POST   | /auth/login      | Authenticate user                          | `username`, `password`                  |
| POST   | /user/create     | Register user                              | `username`, `password`, `passwordConfirm` |
| PUT, PATCH   | /user/update/password     | Update User Password                              | `password`, `newPassword`, `newPasswordConfirm` |
| PUT, PATCH   | /user/update/avatar     | Update User Avatar                              | `newAvatar`|
| DELETE | /user/delete     | Deletes user                               | `userID`                               |
| GET    | /user/getLeaderboard     | Gives 10 user with highest score                   | N/A  |
| GET    | /user/current     | Gives user session data                   | N/A  |
| GET    | /user/logout     | Destroys current session                    | N/A  |                 


## Usage Examples

#### Creating user
```json
POST {{API}}/user/create
content-type: application/json

{
    "username": "sample",
    "password": "12345678",
    "passwordConfirm": "12345678"
}
```

#### Authenticate user
```json
POST {{API}}/auth/login
content-type: application/json

{
    "username": "sample",
    "password": "12345678"
}
```

#### Sending answer
```json
PUT {{API}}/question
content-type: application/json

{
    "answer": "Brasil"
}
```

## Example responses

#### Get current user data
```json
{
  "code": "success",
  "user": {
    "id": "uuid147f-bc20-4cd4-99f9-a9ba787db693",
    "username": "JohnDoe",
    "avatar": "avatars/avatar-16.svg",
    "score": 0,
    "totalQuestions": 0,
    "successResponses": 0,
    "createdAt": "2023-07-19T13:29:19.925Z"
  }
}
```

#### Get question
```json
{
  "id": 17,
  "question": "¿Cuál es el equipo de fútbol con más títulos de la Liga de Fútbol Profesional de España?",
  "correctAnswer": "Real Madrid",
  "options": [
    "Real Madrid",
    "Barcelona",
    "Atlético de Madrid",
    "Valencia"
  ],
  "points": 20,
  "difficulty": "Difícil"
}
```

## Project Status
> Beta


## Room for Improvement

#### Room for improvement:
- Improvement of documentation
- Add support for other database engines

#### To do:
- Categorization of questions


## Important Information

Please read the following information carefully before using this API:

- Authentication is required for certain API endpoints.
- Please note that for the beta version, the questions have been generated with ChatGPT, so there may be errors or inconsistencies in them.


## Contact
Created by [@LZJorge](https://github.com/LZJorge) - feel free to contact me!
