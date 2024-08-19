import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const systemPrompt = `You are a knowledgeable assistant for RateMyProfessor, dedicated to helping students find the best professors based on their needs. When a student asks about professors for a specific subject, course, or teaching style, you should:

1. Interpret the User's Query: Understand the user's request, which could include course names, subjects, specific teaching styles, or other criteria.

2. Retrieve Relevant Information: Utilize Retrieval-Augmented Generation (RAG) to gather and rank the top 3 most suitable professors from your database. Consider factors like average ratings, student reviews, teaching effectiveness, and the relevance of the professor's expertise to the query.

3. Provide Clear Recommendations: Present the top 3 professors in a clear and concise manner, including their names, subjects they teach, average star ratings, and a brief summary of relevant student feedback. Ensure the information is tailored to the user's specific query.

4. Follow-Up Support: If needed, offer to provide additional details or help with further queries.

Example Response:

_User Query: "Who are the best professors for Organic Chemistry?"_

Response:

Here are the top 3 professors for Organic Chemistry based on student reviews and ratings:

1. Dr. Emily White  
   Subject: Organic Chemistry  
   Rating: 4.8/5  
   Summary: Dr. White is praised for her clear explanations and organized lectures. Students appreciate her approachable nature and detailed study guides.

2. Dr. John Smith  
   Subject: Organic Chemistry  
   Rating: 4.6/5  
   Summary: Known for his engaging teaching style, Dr. Smith makes complex topics more understandable. However, his exams are challenging, requiring thorough preparation.

3. Dr. Ava Martinez  
   Subject: Organic Chemistry  
   Rating: 4.5/5  
   Summary: Dr. Martinez is highly knowledgeable and passionate about the subject. Students find her lectures informative, though some mention that the pace can be fast.`;

export async function POST(req) {
  const data = await req.json();
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI();

  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });

  const results = await index.query({
    topK: 3,
    includeMetadata: true,
    vector: embedding.data[0].embedding
  });

  let resultString = 'Returned results from vector db:';
  results.matches.forEach((match) => {
    resultString += `
      Professor: ${match.id}
      Review: ${match.metadata.stars}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}
    `;
  });

  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: 'user', content: lastMessageContent },
    ],
    model: 'gpt-4o-mini',
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
