# Quiz Game (API)
> The following is an API created for a quiz game on different topics.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
* [Endpoints](#endpoints)
* [Usage Examples](#usage-examples)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Important information](#important-information)
* [Contact](#contact)

## General Information
> The main objective of this project is to provide users with a platform where they can have fun and learn with interesting questions and facts.


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

# 2. Install dependencies
npm install

# 3. Compile TypeScript code
npm run build

# 4. Start the server
npm start
```

## Usage
The API is used through HTTP requests to the available endpoints.

## Endpoints

Below is a table of the available endpoints in this API.

| Method | URL              | Description                                | Request body                            |
| ------ | ---------------- | ------------------------------------------ | --------------------------------------- |
| GET    | /question        | Gives a random question (active a question) | N/A                                     |
| PUT    | /question        | Send answer (to user active question)       | `answer`                                |
| POST   | /user/create     | Register user                              | `username`, `password`, `passwordConfirm` |
| DELETE | /user/delete     | Deletes user                               | `userID`                               |
| POST   | /auth/login      | Authenticate user                          | `username`, `password`                  |
| GET    | /user/logout     | Destroys current session                    | N/A                                     |


## Usage examples

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

## Project Status
> Beta


## Room for Improvement

#### Room for improvement:
- Improvement of documentation
- Add endpoints to edit and delete questions
- Add support for other database engines

#### To do:
- Categorization of questions
- Leaderboards


## Important Information

Please read the following information carefully before using this API:

- Authentication is required for certain API endpoints.
- Please note that for the beta version, the questions have been generated with ChatGPT, so there may be errors or inconsistencies in them.


## Contact
Created by [@LZJorge](https://github.com/LZJorge) - feel free to contact me!
