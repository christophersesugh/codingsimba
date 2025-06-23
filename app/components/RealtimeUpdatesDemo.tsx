import React from "react";

/**
 * Demo component: Connects to the WebSocket proxy server and streams updates to the UI.
 * Adjust the wsUrl as needed for your environment.
 */
export function RealtimeUpdatesDemo() {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  const wsRef = React.useRef<WebSocket | null>(null);
  const wsUrl = "ws://localhost:3001"; // Change to your proxy server URL/port

  React.useEffect(() => {
    const ws = new window.WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        maxWidth: 400,
      }}
    >
      <h2>Realtime Updates Demo</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "70%", marginRight: 8 }}
        />
        <button onClick={sendMessage} disabled={!input}>
          Send
        </button>
      </div>
      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          background: "#f9f9f9",
          padding: 8,
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {messages.map((msg, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              <span style={{ color: "#555" }}>{msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RealtimeUpdatesDemo;
