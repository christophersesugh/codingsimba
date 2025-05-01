import type { SandpackTemplate } from ".";

export const defaultFileByTemplate: Record<
  SandpackTemplate,
  Record<string, string>
> = {
  vanilla: { "/index.js": "document.body.innerHTML = '<h1>Hello</h1>';" },
  "vanilla-ts": { "/index.ts": "document.body.innerHTML = '<h1>Hello</h1>';" },
  "vite-react": {
    "/App.jsx": "export default function App() { return <h1>Hello</h1>; }",
  },
  "vite-react-ts": {
    "/App.tsx": "export default function App() { return <h1>Hello</h1>; }",
  },
  node: { "/index.js": "console.log('Hello from Node.js');" },
  static: { "/index.html": "<h1>Hello World</h1>" },
};
