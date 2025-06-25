import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { generateMetadata } from "~/utils/meta";
import { Header } from "~/components/page-header";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I get started with a course?",
    answer:
      "Simply browse our course catalog, select a course that interests you, and click 'Start Learning'. You can begin with our free courses or upgrade to a premium plan for access to all content.",
    category: "Getting Started",
  },
  {
    question: "Can I download course materials for offline viewing?",
    answer:
      "Yes! Pro and Team subscribers can download course materials and videos for offline viewing through our mobile app and desktop platform.",
    category: "Features",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
    category: "Billing",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards. For Team and Enterprise plans, we also support invoicing and bank transfers.",
    category: "Billing",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click the 'Forgot Password' link on the login page. We'll send you an email with instructions to reset your password securely.",
    category: "Account",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for all subscription plans. If you're not satisfied, you can request a full refund within 30 days.",
    category: "Billing",
  },
];

function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
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
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        time: "Just now",
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate agent response
      setTimeout(() => {
        const agentResponse = {
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
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 p-0 shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-2xl">
        <CardHeader className="bg-blue-600 text-white dark:bg-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="h-4 w-4" />
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

function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-start gap-4">
                <Badge variant="secondary" className="shrink-0">
                  {faq.category}
                </Badge>
                <span className="pr-4 font-medium text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500" />
              )}
            </button>

            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                <div className="p-6 pt-4">
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <>
      {generateMetadata({
        title: "Support - Get Help When You Need It",
        description:
          "Get help with your account, courses, billing, and more. Our support team is here to assist you 24/7.",
      })}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          title="How Can We Help?"
          description="Get the support you need to make the most of your learning journey"
        />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Chat with our support team in real-time for immediate
                      assistance
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      <Clock className="mr-1 h-3 w-3" />
                      Available 24/7
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Email Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Send us a detailed message and we&apos;ll get back to you
                      within 24 hours
                    </p>
                    <Button variant="outline" className="w-full">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Phone Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Call us directly for urgent issues (Enterprise customers
                      only)
                    </p>
                    <Badge variant="secondary">Enterprise Only</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-12 max-w-4xl"
            >
              <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Find quick answers to common questions
              </p>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <FAQSection />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl"
            >
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                Still Need Help?
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>support@codingsimba.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>24/7 Support Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-5 w-5 text-gray-500" />
                          <span>Live Chat (Bottom Right)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">
                        Response Times
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Live Chat:</span>
                          <Badge variant="secondary">Instant</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Email Support:</span>
                          <Badge variant="secondary">Within 24h</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone Support:</span>
                          <Badge variant="secondary">Enterprise Only</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      <LiveChat />
    </>
  );
}
