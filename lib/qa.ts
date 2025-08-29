import OpenAI from "openai";

let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error("Failed to initialize OpenAI:", error);
}

export async function generateAnswer(question: string): Promise<string> {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are an expert assistant specializing in JavaScript, React, and Next.js. Provide concise, accurate answers with code examples when helpful. If a question is outside these topics, politely decline to answer." 
          },
          { role: "user", content: question },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const answer = response.choices[0]?.message?.content?.trim();
      if (answer) return answer;
    } catch (err: any) {
      console.error("OpenAI API error:", err.message || err);
    }
  }

  return getLocalAnswer(question);
}

function getLocalAnswer(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('react') || q.includes('what is react')) {
    return "React is a JavaScript library for building user interfaces, particularly web applications. It allows you to create reusable UI components and efficiently update and render them when data changes.\n\nKey features:\n- Component-based architecture\n- Virtual DOM for performance\n- JSX syntax for writing HTML in JavaScript\n- Unidirectional data flow\n- Hooks for state and lifecycle management\n\nExample of a simple React component:\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```";
  }
  
  if (q.includes('debouncing') || q.includes('debounce')) {
    return "Debouncing is a programming technique that limits the rate at which a function can fire. It ensures that time-consuming tasks don't fire so often, which can improve performance.\n\nIn React, you might use debouncing for:\n- Search input fields\n- Window resize events\n- API calls on user input\n\nExample using Lodash:\n```javascript\nimport { debounce } from 'lodash';\n\nconst handleSearch = debounce((searchTerm) => {\n  // API call or expensive operation\n  fetchResults(searchTerm);\n}, 300);\n\n// Or with React hooks:\nconst DebouncedInput = () => {\n  const [value, setValue] = useState('');\n  \n  const debouncedSearch = useCallback(\n    debounce((searchValue) => {\n      // Perform search\n    }, 300),\n    []\n  );\n  \n  const handleChange = (e) => {\n    setValue(e.target.value);\n    debouncedSearch(e.target.value);\n  };\n  \n  return <input value={value} onChange={handleChange} />;\n};\n```";
  }
  
  if (q.includes('usestate') || q.includes('state')) {
    return "useState is a React Hook that lets you add state to functional components.\n\nExample:\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```";
  }
  
  if (q.includes('usecontext') || q.includes('context')) {
    return "useContext is a React Hook that lets you subscribe to React context without introducing nesting. It helps with prop drilling.\n\nExample:\n```jsx\nimport { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Themed button</button>;\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <ThemedButton />\n    </ThemeContext.Provider>\n  );\n}\n```";
  }
  
  if (q.includes('next.js') || q.includes('nextjs')) {
    return "Next.js is a React framework that enables server-side rendering, static site generation, and other performance optimizations out of the box.\n\nKey features:\n- Server-side rendering (SSR)\n- Static site generation (SSG)\n- File-based routing\n- API routes\n- Built-in CSS and Sass support\n- Image optimization\n\nExample page structure:\n```\npages/\n  index.js       → /\n  about.js       → /about\n  blog/[slug].js → /blog/hello-world\n```";
  }
  
  return "I specialize in JavaScript, React, and Next.js questions. Could you ask something related to these technologies? For example:\n- 'What are React hooks?'\n- 'How does Next.js routing work?'\n- 'What is the virtual DOM?'\n- 'How to optimize React performance?'";
}