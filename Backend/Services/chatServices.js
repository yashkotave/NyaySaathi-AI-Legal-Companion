const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEN_AI_API });
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Pinecone } = require("@pinecone-database/pinecone");

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEN_AI_API,
  model: "gemini-embedding-2",
  outputDimensionality: 768,
});

const pinecone = new Pinecone();
let History = [];

// -------------------- Rewriting the User Query --------------------
async function transformQuery() {
  try {
   const response = await ai.models.generateContent({
  model: "gemini-flash-lite-latest",
  contents: History,
  config: {
    systemInstruction: `
You are an expert in legal language and question clarification.  
Your task: Rewrite the "Follow Up User Question" from the conversation history into a clear, standalone legal question that:
- Includes all necessary details from the history.
- Removes ambiguity or slang.
- Stands on its own without previous context.
Only return the rewritten question. No extra text or commentary.
    `,
  },
});;

    return response.text.trim();
  } catch (err) {
  console.error("Error in transformQuery:", err);
  throw err;
}
}

// -------------------- Main Bot Response --------------------
async function getBotResponse(messages, question) {
  if (!messages) throw new Error("Invalid messages array");

   History = JSON.parse(JSON.stringify(messages));

 const newQuery = await transformQuery(question);

if (!newQuery) {
  throw new Error("Query transformation failed");
}

const queryVector = await embeddings.embedQuery(newQuery);
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });

  const context = searchResults.matches
    .map((match) => match.metadata.text)
    .join("\n\n---\n\n");

  History.pop();
  History.push({
    role: "user",
    parts: [{ text: newQuery }],
  });

  const response = await ai.models.generateContent({
   model: "gemini-flash-lite-latest",
    contents: History,
    config: {
      systemInstruction: `
You are a highly trained legal assistant with deep expertise in **Indian laws, acts, and constitutional provisions**.

You will receive:
1. A user's legal question.
2. A legal context retrieved from Indian law resources.

📌 **Response Format (Maximum 5–7 sentences total):**
1. **Direct Answer:** 1–2 short sentences.
2. **Legal Reasoning:** 2–3 sentences explaining why, citing the relevant law from context.
3. **Reference:** Mention the section/act name briefly.
4. **Advice:** 1–2 sentences suggesting next steps.

If no clear answer is found in the context:
- Say: "I could not find the answer based on the available legal context."
- Briefly suggest where they can check or which authority to contact.

Keep language **clear and simple** so any person can understand.
Avoid repeating the question in the answer.

Legal Context:
${context}
`
,
    },
  });

 



  return response.text.trim();
}

// -------------------- Conversation Summary --------------------
async function getSummary(messages) {
  if (!messages) throw new Error("Invalid messages array");

  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: [
      ...messages,
      {
        role: "user",
        parts: [
          { text: "Summarize the above conversation in 2-3 words only." },
        ],
      },
    ],
  });

  return response.text.trim();
}

module.exports = {
  getBotResponse,
  getSummary,
};
