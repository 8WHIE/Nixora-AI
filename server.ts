import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 3000;

/* =========================================================
   CORS
   ========================================================= */

const allowedOrigins = [
  'https://8whie.github.io',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

/* =========================================================
   Body Parser
   ========================================================= */

app.use(
  express.json({
    limit: '15mb',
  })
);

/* =========================================================
   Gemini Client
   ========================================================= */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    '⚠️ GEMINI_API_KEY is not configured. Gemini requests will fail.'
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/* =========================================================
   Nixora AI System Instruction
   ========================================================= */

const NIXORA_SYSTEM_INSTRUCTION = `
You are Nixora AI, a world-class coding and productivity
super-assistant.

=========================================================
IDENTITY & OWNERSHIP
=========================================================

Your name is Nixora AI.

Nixora AI was created and developed by 8WHIE.

The owner of Nixora AI is Aryan Thakur.

Important identity facts:

- AI Name: Nixora AI
- Creator/Developer: 8WHIE
- Owner: Aryan Thakur
- Tagline: "Intelligence Without Limits"

If a user asks any question such as:

- Who created Nixora AI?
- Who made Nixora AI?
- Who developed Nixora AI?
- Who is the creator of Nixora AI?
- Who is the developer of Nixora AI?
- Who owns Nixora AI?
- Who is the owner of Nixora AI?
- Who is the founder of Nixora AI?
- Who is behind Nixora AI?
- What is Nixora AI?
- Who built you?
- Who made you?
- Who is your owner?
- Who is your creator?

Answer clearly and consistently using these facts:

"Nixora AI was created and developed by 8WHIE, and its owner is Aryan Thakur."

If the user asks in Hindi or Hinglish, you can answer:

"Nixora AI ko 8WHIE ne create aur develop kiya hai, aur iska owner Aryan Thakur hai."

Do not change, invent, or contradict these identity details.

=========================================================
GENERAL INFORMATION
=========================================================

Tagline: "Intelligence Without Limits".

You specialize in:

- Software engineering
- Android development
- Kotlin
- Jetpack Compose
- Material 3
- Gradle
- Coroutines
- StateFlow
- MVVM
- Repository architecture
- Full-stack web development
- React
- TypeScript
- Node.js
- Python
- Java
- C++
- SQL
- Rust
- Go
- Data Structures & Algorithms
- System architecture
- Debugging
- Performance optimization
- Code generation

Guidelines:

1. Always provide clean, production-ready code.

2. When answering coding questions, explain the solution clearly.

3. Use proper Markdown code blocks with language tags.

4. When relevant, include time and space complexity.

5. Suggest performance improvements and edge cases when useful.

6. For Android development, prefer modern Jetpack Compose,
   Material 3 and modern architecture such as MVVM,
   StateFlow and Repository patterns.

7. Avoid unnecessary complexity.

8. Maintain a professional, futuristic and concise tone.

9. Never expose API keys, secrets or private credentials.

10. If the user provides an error, first identify the likely
    root cause and then provide a practical fix.

11. When users ask about Nixora AI's identity, creator,
    developer, owner, or origin, use the identity information
    provided above and do not contradict it.
`;

/* =========================================================
   Health Check
   ========================================================= */

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Nixora AI',
    tagline: 'Intelligence Without Limits',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    defaultModel: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   Models
   ========================================================= */

app.get('/api/models', (_req: Request, res: Response) => {
  res.json({
    models: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash',
        badge: 'Recommended',
        description:
          'Fast model for coding, chat and analysis.',
        speed: 'Super Fast',
        context: '1M tokens',
      },
      {
        id: 'gemini-3.1-pro-preview',
        name: 'Gemini 3.1 Pro Preview',
        badge: 'Deep Reasoning',
        description:
          'Reasoning-focused model for architecture and complex debugging.',
        speed: 'Balanced',
        context: '2M tokens',
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
        badge: 'Lightweight',
        description:
          'Lightweight model for fast responses and snippets.',
        speed: 'Fast',
        context: '500K tokens',
      },
    ],
  });
});

/* =========================================================
   Gemini Helper
   ========================================================= */

async function callGeminiContent(
  model: string,
  contents: any,
  config?: any
) {
  const primaryModel = model || 'gemini-3.8-flash';

  try {
    return await ai.models.generateContent({
      model: primaryModel,
      contents,
      config,
    });
  } catch (primaryError: any) {
    console.warn(
      `Primary model ${primaryModel} failed. Trying fallback model.`,
      primaryError?.message
    );

    return await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config,
    });
  }
}

/* =========================================================
   Chat Streaming API
   ========================================================= */

app.post(
  '/api/chat/stream',
  async (req: Request, res: Response) => {
    const {
      messages,
      model,
      systemPrompt,
      temperature,
    } = req.body;

    if (!Array.isArray(messages)) {
      res.status(400).json({
        error: 'Messages array is required',
      });

      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });

      return;
    }

    /* -------------------------------------------------------
       SSE Headers
       ------------------------------------------------------- */

    res.status(200);

    res.setHeader(
      'Content-Type',
      'text/event-stream; charset=utf-8'
    );

    res.setHeader(
      'Cache-Control',
      'no-cache, no-transform'
    );

    res.setHeader('Connection', 'keep-alive');

    res.setHeader(
      'X-Accel-Buffering',
      'no'
    );

    res.flushHeaders?.();

    /* -------------------------------------------------------
       Client Disconnect
       ------------------------------------------------------- */

    let clientDisconnected = false;

    req.on('close', () => {
      clientDisconnected = true;
    });

    /* -------------------------------------------------------
       Format Messages
       ------------------------------------------------------- */

    const formattedContents = messages.map(
      (message: {
        role: string;
        content: string;
      }) => ({
        role:
          message.role === 'user'
            ? 'user'
            : 'model',

        parts: [
          {
            text: String(message.content ?? ''),
          },
        ],
      })
    );

    const primaryModel =
      model || 'gemini-3.8-flash';

    const finalTemperature =
      typeof temperature === 'number'
        ? temperature
        : 0.7;

    try {
      let responseStream;

      /* -----------------------------------------------------
         Primary Model
         ----------------------------------------------------- */

      try {
        responseStream =
          await ai.models.generateContentStream({
            model: primaryModel,

            contents: formattedContents,

            config: {
              systemInstruction:
                systemPrompt ||
                NIXORA_SYSTEM_INSTRUCTION,

              temperature: finalTemperature,
            },
          });
      } catch (primaryStreamError: any) {
        console.warn(
          `Streaming with ${primaryModel} failed. Trying fallback.`,
          primaryStreamError?.message
        );

        /* ---------------------------------------------------
           Fallback Model
           --------------------------------------------------- */

        responseStream =
          await ai.models.generateContentStream({
            model: 'gemini-3.1-flash-lite',

            contents: formattedContents,

            config: {
              systemInstruction:
                systemPrompt ||
                NIXORA_SYSTEM_INSTRUCTION,

              temperature: finalTemperature,
            },
          });
      }

      /* -----------------------------------------------------
         Stream Response
         ----------------------------------------------------- */

      for await (const chunk of responseStream) {
        if (clientDisconnected) {
          break;
        }

        const text = chunk.text;

        if (text) {
          res.write(
            `data: ${JSON.stringify({
              text,
            })}\n\n`
          );
        }
      }

      if (!clientDisconnected) {
        res.write('data: [DONE]\n\n');
        res.end();
      }
    } catch (error: any) {
      console.error(
        'Gemini Stream Error:',
        error
      );

      if (!clientDisconnected) {
        const errorMessage =
          error?.message ||
          'Error communicating with Gemini model';

        res.write(
          `data: ${JSON.stringify({
            error: errorMessage,
          })}\n\n`
        );

        res.write('data: [DONE]\n\n');
        res.end();
      }
    }
  }
);

/* =========================================================
   Code Debugger
   ========================================================= */

app.post(
  '/api/code/debug',
  async (req: Request, res: Response) => {
    const {
      code,
      language,
      errorDescription,
    } = req.body;

    if (!code) {
      res.status(400).json({
        error: 'Code is required for debugging',
      });

      return;
    }

    try {
      const prompt = `
Analyze and fix the following ${language || 'code'}.

Error or Issue Description:
${
  errorDescription ||
  'Identify syntax errors, logical errors, edge cases, memory leaks and performance issues.'
}

Code:

\`\`\`${language || ''}
${code}
\`\`\`

Return a valid JSON object:

{
  "fixedCode": string,
  "bugType": string,
  "explanation": string,
  "diffSummary": string[],
  "performanceTip": string
}
`;

      const response =
        await callGeminiContent(
          'gemini-3.8-flash',
          prompt,
          {
            responseMimeType:
              'application/json',
          }
        );

      const parsed = JSON.parse(
        response.text || '{}'
      );

      res.json(parsed);
    } catch (error: any) {
      console.error(
        'Debug API Error:',
        error
      );

      res.status(500).json({
        error:
          error?.message ||
          'Failed to debug code',
      });
    }
  }
);

/* =========================================================
   Line-by-Line Code Explanation
   ========================================================= */

app.post(
  '/api/code/explain-lines',
  async (req: Request, res: Response) => {
    const { code, language } = req.body;

    if (!code) {
      res.status(400).json({
        error: 'Code is required',
      });

      return;
    }

    try {
      const prompt = `
Inspect the following ${language || ''} code.

Provide a useful line-by-line explanation.

Code:

\`\`\`${language || ''}
${code}
\`\`\`

Return valid JSON:

{
  "overview": string,
  "timeComplexity": string,
  "spaceComplexity": string,
  "lines": [
    {
      "lineNumber": number,
      "code": string,
      "explanation": string,
      "importance": "high" | "normal" | "setup"
    }
  ]
}
`;

      const response =
        await callGeminiContent(
          'gemini-3.8-flash',
          prompt,
          {
            responseMimeType:
              'application/json',
          }
        );

      const parsed = JSON.parse(
        response.text || '{}'
      );

      res.json(parsed);
    } catch (error: any) {
      console.error(
        'Explain Lines API Error:',
        error
      );

      /* ---------------------------------------------------
         Deterministic Fallback
         --------------------------------------------------- */

      const rawLines =
        String(code).split('\n');

      res.json({
        overview:
          'Structured inspection of the code flow, state and computational branches.',

        timeComplexity: 'O(N)',

        spaceComplexity: 'O(1)',

        lines: rawLines
          .slice(0, 30)
          .map(
            (
              line: string,
              index: number
            ) => ({
              lineNumber: index + 1,

              code: line,

              explanation:
                line
                  .trim()
                  .startsWith('//') ||
                line
                  .trim()
                  .startsWith('#')
                  ? 'Documentation or comment.'
                  : line.includes(
                      'function'
                    ) ||
                    line.includes(
                      'def'
                    ) ||
                    line.includes('fun')
                  ? 'Declares a function or sub-routine.'
                  : line.includes(
                      'return'
                    )
                  ? 'Returns a value from the current execution context.'
                  : 'Executes an expression, assignment or operation.',

              importance:
                line.includes(
                  'return'
                ) ||
                line.includes(
                  'function'
                ) ||
                line.includes('def') ||
                line.includes('fun')
                  ? 'high'
                  : 'normal',
            })
          ),
      });
    }
  }
);

/* =========================================================
   DSA Solver
   ========================================================= */

app.post(
  '/api/code/dsa-solver',
  async (req: Request, res: Response) => {
    const {
      problem,
      language,
    } = req.body;

    if (!problem) {
      res.status(400).json({
        error:
          'Problem description is required',
      });

      return;
    }

    try {
      const prompt = `
You are an elite competitive programmer and
technical interviewer.

Solve the following problem in
${language || 'Python'}:

"${problem}"

Return valid JSON:

{
  "title": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "intuition": string,
  "approach": string,
  "timeComplexity": string,
  "spaceComplexity": string,
  "solutionCode": string,
  "edgeCases": string[],
  "testCases": [
    {
      "input": string,
      "expectedOutput": string,
      "explanation": string
    }
  ]
}
`;

      const response =
        await callGeminiContent(
          'gemini-3.8-flash',
          prompt,
          {
            responseMimeType:
              'application/json',
          }
        );

      const parsed = JSON.parse(
        response.text || '{}'
      );

      res.json(parsed);
    } catch (error: any) {
      console.error(
        'DSA Solver Error:',
        error
      );

      res.status(500).json({
        error:
          error?.message ||
          'Failed to solve DSA problem',
      });
    }
  }
);

/* =========================================================
   Complete Project Generator
   ========================================================= */

app.post(
  '/api/code/generate-project',
  async (req: Request, res: Response) => {
    const {
      prompt,
      type,
    } = req.body;

    if (!prompt) {
      res.status(400).json({
        error:
          'Project prompt is required',
      });

      return;
    }

    try {
      const systemPrompt = `
You are a Principal Software Architect at Nixora AI.

Generate a complete, ready-to-run multi-file
project for the requested prompt.

Project category:
${type || 'general software'}

Return valid JSON:

{
  "projectName": string,
  "description": string,
  "techStack": string[],
  "instructions": string,
  "files": [
    {
      "path": string,
      "language": string,
      "content": string,
      "description": string
    }
  ]
}
`;

      const response =
        await callGeminiContent(
          'gemini-3.8-flash',
          prompt,
          {
            systemInstruction:
              systemPrompt,

            responseMimeType:
              'application/json',
          }
        );

      const parsed = JSON.parse(
        response.text || '{}'
      );

      res.json(parsed);
    } catch (error: any) {
      console.error(
        'Project Generator Error:',
        error
      );

      res.status(500).json({
        error:
          error?.message ||
          'Failed to generate project',
      });
    }
  }
);

/* =========================================================
   Production Static Files
   ========================================================= */

async function startServer() {
  const isProduction =
    process.env.NODE_ENV === 'production';

  if (!isProduction) {
    /* -----------------------------------------------------
       Development
       ----------------------------------------------------- */

    const {
      createServer: createViteServer,
    } = await import('vite');

    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: 'spa',
      });

    app.use(vite.middlewares);
  } else {
    /* -----------------------------------------------------
       Production
       ----------------------------------------------------- */

    const distPath =
      path.join(__dirname, 'dist');

    app.use(
      express.static(distPath)
    );

    app.use(
      (
        req: Request,
        res: Response,
        next
      ) => {
        if (req.method !== 'GET') {
          next();
          return;
        }

        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      }
    );
  }

  /* =======================================================
     Start HTTP Server
     ======================================================= */

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `🚀 Nixora AI Server running on port ${PORT}`
      );

      console.log("Server initialized.");
    }
  );
}

startServer().catch(console.error);
