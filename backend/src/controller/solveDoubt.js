const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
    try {
        let { messages, title, description, testCases, startCode } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        // Check if API Key is missing
        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            return res.status(400).json({
                message: "⚠️ Gemini API key is missing. Please get a free API key from https://aistudio.google.com/app/apikey and set GEMINI_API_KEY in backend/.env"
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Format and sanitize messages for Gemini SDK
        let formattedContents = [];

        if (typeof messages === 'string') {
            formattedContents = [{ role: 'user', parts: [{ text: messages }] }];
        } else if (Array.isArray(messages) && messages.length > 0) {
            formattedContents = messages.map(m => {
                if (typeof m === 'string') {
                    return { role: 'user', parts: [{ text: m }] };
                }
                const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
                let textContent = '';
                if (Array.isArray(m.parts) && m.parts[0]?.text) {
                    textContent = m.parts[0].text;
                } else if (typeof m.content === 'string') {
                    textContent = m.content;
                } else if (typeof m.text === 'string') {
                    textContent = m.text;
                }
                return { role, parts: [{ text: textContent || 'Hello' }] };
            });
        } else {
            formattedContents = [{ role: 'user', parts: [{ text: `Hello, please help me with ${title || 'coding problem'}.` }] }];
        }

        // Construct System Context Prompt
        let systemInstruction = `You are CodeMaster AI, an expert software engineer and competitive programming mentor.
Your role is to help students learn algorithms, debug code, and understand Data Structures and Algorithms (DSA).

CURRENT PROBLEM CONTEXT:
- Title: ${title || 'Coding Problem'}
- Description: ${description || 'N/A'}
${Array.isArray(testCases) && testCases.length > 0 ? `- Test Cases: ${JSON.stringify(testCases.slice(0, 2))}` : ''}
${Array.isArray(startCode) && startCode.length > 0 ? `- Starter Templates: ${JSON.stringify(startCode.map(s => s.language))}` : ''}

CAPABILITIES:
1. **Hint Provider**: Give helpful step-by-step hints without spoiling the full solution immediately unless asked.
2. **Code Reviewer**: Debug and fix code submissions with clear explanations.
3. **Solution Guide**: Provide optimal solutions with detailed explanations.
4. **Complexity Analyzer**: Explain time and space complexity trade-offs.
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.).

## INTERACTION GUIDELINES:
- Provide clear, well-formatted markdown responses.
- Enclose code snippets in proper language code blocks (e.g. \`\`\`cpp, \`\`\`javascript, \`\`\`java).
- Focus on helping the user learn and understand DSA concepts.
- Be concise, friendly, and structured.
`;

        let response;
        const candidateModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                response = await ai.models.generateContent({
                    model: modelName,
                    contents: formattedContents,
                    config: {
                        systemInstruction
                    }
                });
                if (response && response.text) {
                    break;
                }
            } catch (err) {
                lastError = err;
                console.warn(`Model ${modelName} failed...`, err.message || err);
            }
        }

        if (!response || !response.text) {
            throw lastError || new Error("Failed to generate response from Gemini API.");
        }

        return res.status(200).json({
            message: response.text
        });

    } catch (err) {
        console.error("AI SolveDoubt error:", err.message || err);

        const isRateLimit = err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("Quota exceeded");
        const isApiKeyError = err?.message?.includes("API key not valid") || err?.message?.includes("API_KEY_INVALID") || err?.message?.includes("404");

        let userFriendlyMsg = err?.message || "Internal server error in AI Assistant";
        if (isRateLimit) {
            userFriendlyMsg = "⚠️ Gemini API free tier rate limit reached. Please wait ~30 seconds before sending another message, or provide your own free key in backend/.env.";
        } else if (isApiKeyError) {
            userFriendlyMsg = "⚠️ Invalid or missing Gemini API Key. Please get a free API key from https://aistudio.google.com/app/apikey and update GEMINI_API_KEY in backend/.env";
        }

        return res.status(400).json({
            message: userFriendlyMsg
        });
    }
};

module.exports = solveDoubt;
