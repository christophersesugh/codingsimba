import { useState } from "react";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "./ui/textarea";

interface Message {
  id: number;
  text: string;
  sender: "user" | "agent";
  time: string;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! How can I help you today?",
      sender: "agent",
      time: "Just now",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        time: "Just now",
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate agent response
      setTimeout(() => {
        const agentResponse: Message = {
          id: messages.length + 2,
          text: "Thanks for your message! Our team will get back to you shortly.",
          sender: "agent",
          time: "Just now",
        };
        setMessages((prev) => [...prev, agentResponse]);
      }, 1000);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="size-10 rounded-full bg-blue-600 p-0 shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <MessageCircle className="size-6" />
      </Button>
    );
  }

  return (
    <div className="w-80">
      <Card className="shadow-2xl">
        <CardHeader className="flex items-center justify-between bg-blue-600 text-white dark:bg-blue-500">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            <CardTitle className="text-lg">Live Chat</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="size-8 p-0 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isMinimized ? (
                <Maximize2 className="size-4" />
              ) : (
                <Minimize2 className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="size-8 p-0 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            <div className="flex h-80 flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white dark:bg-blue-500"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="mt-1 text-xs opacity-70">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                    rows={1}
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
