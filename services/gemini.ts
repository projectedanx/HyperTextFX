import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { AIContext, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-pro-preview";

// Tool definition to allow Gemini to modify editor content
const updateEditorTool: FunctionDeclaration = {
  name: 'update_editor',
  description: 'Modifies the text editor content. Use this to perform edits, refactors, or rewrites requested by the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      text: {
        type: Type.STRING,
        description: 'The new text content to replace the target with.',
      },
      target: {
        type: Type.STRING,
        enum: ['selection', 'document'],
        description: 'Whether to replace the currently selected text ("selection") or the entire document ("document"). Defaults to "selection" if a selection exists, otherwise "document".',
      },
    },
    required: ['text'],
  },
};

export async function* streamGeminiResponse(
  history: ChatMessage[],
  context: AIContext,
  isThinkingMode: boolean,
  onToolCall: (toolCall: any) => Promise<any>
) {
  // Construct a system instruction that includes the current editor state
  const systemInstruction = `
You are HyperTextFX AI, an expert coding assistant and text processor embedded in a text editor.
You have access to the user's current file.

CURRENT FILE CONTEXT:
Filename: ${context.fileName}
Cursor Line: ${context.cursor.line}, Column: ${context.cursor.col}
Has Selection: ${context.selection ? 'Yes' : 'No'}

CONTENT SNIPPET (First 1000 chars):
${context.fullText.slice(0, 1000)}${context.fullText.length > 1000 ? '...' : ''}

${context.selection ? `\nCURRENT SELECTION:\n${context.selection}\n` : ''}

If the user asks to modify the text, refactor code, or fix issues, use the "update_editor" tool.
If the user asks a question, answer concisely.
  `.trim();

  // Convert internal history to Gemini format
  // Note: We only send text history for simplicity in this stateless wrapper
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const tools = [{ functionDeclarations: [updateEditorTool] }];

  // Configure Thinking Mode
  const config: any = {
    tools,
    systemInstruction,
  };

  if (isThinkingMode) {
    config.thinkingConfig = { thinkingBudget: 32768 }; // Max for gemini-3-pro
    // DO NOT set maxOutputTokens when using thinkingConfig with high budget to avoid truncation
  } else {
    // Standard config
    config.temperature = 0.7;
  }

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config,
    });

    // Add previous history to chat
    // Note: In a real persistent app, we'd maintain the chat object. 
    // Here we re-hydrate for the "stateless" effect of the hook.
    // However, for streaming, we usually just send the last message if we aren't maintaining the session object.
    // To keep it simple and robust, we'll just send the last user message with context as system prompt.
    // A more advanced implementation would persist the `chat` instance.
    
    const lastUserMessage = history[history.length - 1];
    if (lastUserMessage.role !== 'user') return;

    const result = await chat.sendMessageStream({
        message: lastUserMessage.text
    });

    for await (const chunk of result) {
      // Handle Function Calls (Tools)
      const functionCalls = chunk.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
           const toolResult = await onToolCall(call);
           // Send tool result back to model to continue generation
           // For this simplified stream, we might just yield a system message saying "Edit Applied".
           // In a full chat loop, we would `chat.sendMessage(toolResponse)`.
           // Here, we just notify the UI that an action occurred.
           yield { type: 'tool', name: call.name, result: toolResult };
        }
      }
      
      // Handle Text Content
      const text = chunk.text;
      if (text) {
        yield { type: 'text', content: text };
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield { type: 'error', content: "I encountered an error processing your request." };
  }
}
