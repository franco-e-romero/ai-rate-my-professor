# AI Rate My Professor

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [License](#license)

## Description

AI Rate My Professor is a web application designed to assist students in finding the best professors based on their specific needs and preferences. Leveraging OpenAI's language model and Pinecone's vector database, this application provides personalized recommendations for professors using student reviews and ratings.

## Features

- **AI-Driven Recommendations**: Utilize OpenAI's GPT-4 model to generate responses and recommendations based on user queries.
- **Advanced Search**: Retrieve and rank top professors using Pinecone's vector database based on user input.
- **Interactive Chat Interface**: Engage with the AI assistant through a modern chat interface built with React and Material-UI.
- **Real-Time Response**: Stream responses from the AI to provide a seamless and interactive user experience.

## Technologies Used

- **Frontend**: Next.js, React, Material-UI
- **Backend**: Next.js API routes
- **AI Integration**: OpenAI API
- **Vector Database**: Pinecone

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ai-rate-my-professor.git
   cd ai-rate-my-professor
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables:**
   - Obtain your API keys from OpenAI and Pinecone.
   - Create a `.env.local` file in the root directory of the project and add the following environment variables:
     ```env
     PINECONE_API_KEY=your_pinecone_api_key
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the application.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.# Rate-my-Professor-RAG
