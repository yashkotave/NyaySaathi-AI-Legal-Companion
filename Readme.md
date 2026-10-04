# NyaySaathi

NyaySaathi is an AI-powered legal assistance platform designed to help users ask legal questions and receive helpful, context-aware answers in a simple and secure chat experience. The application combines a modern React frontend, a Node.js/Express backend, MongoDB for user data, and a RAG-based AI pipeline using Pinecone and Google Generative AI for document-grounded legal responses.

## Overview

The platform is built to make legal information more accessible to everyday users in India by blending conversational AI with trusted legal document retrieval. Instead of relying only on a generic chatbot, the system retrieves relevant legal content, grounds the answer in that context, and then generates a response that is more useful and reliable.

## Key Features

- User authentication with registration, login, and protected routes
- Secure JWT-based session handling
- AI-powered legal chat with chat history support
- Retrieval-Augmented Generation (RAG) approach for grounded responses
- Legal document indexing and semantic retrieval using Pinecone
- Modern frontend experience with React + Vite + Tailwind CSS
- Express backend with validation, middleware, and MongoDB integration

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Cookie-based auth
- Express Validator
- CORS

### AI and Search
- Google Generative AI
- LangChain
- Pinecone vector database
- Retrieval-Augmented Generation (RAG)

## Project Structure

```bash
NyaySaathi/
├── Backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routers/
│   ├── Services/
│   ├── app.js
│   ├── db.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── Readme.md
└── .gitignore
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a remote MongoDB instance
- A Pinecone account and index
- A Google Generative AI API key

## Running the Project

### 1) Install backend dependencies

```bash
cd Backend
npm install
```

### 2) Start the backend server

```bash
node app.js
```

Or, for development with auto-reload:

```bash
npx nodemon app.js
```

Backend server will run at:

```bash
http://localhost:8080
```

### 3) Install frontend dependencies

```bash
cd Frontend
npm install
```

### 4) Start the frontend app

```bash
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

## API Endpoints

### User Routes
- `POST /users/register` - Register a new user
- `POST /users/login` - Login a user
- `GET /users/profile` - Fetch authenticated user profile
- `GET /users/logout` - Logout the current user

### Chat Routes
- `POST /chats` - Create a chat session
- `GET /chats/:id` - Load an existing chat
- `POST /chats/summary/bulk` - Fetch summary data for chats

## Application Flow

1. User signs up or logs in through the React app.
2. The frontend sends requests to the Express backend.
3. The backend authenticates users and manages chat sessions.
4. Relevant legal documents are retrieved from Pinecone.
5. A large language model generates a grounded response using the retrieved context.
6. The final answer is returned to the user in the frontend chat UI.

## Notes

This project is currently a local development project and is meant to be extended with production-ready deployment, better legal knowledge sources, improved prompt engineering, and more robust moderation and validation layers.

## Future Improvements

- Add admin dashboard for legal content management
- Expand document ingestion from more legal sources
- Improve response validation and citation mechanisms
- Add richer analytics and user activity tracking
- Prepare deployment pipeline for production hosting
