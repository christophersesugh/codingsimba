import { ContactForm } from "~/components/contact/form";
import { ContactInformation } from "~/components/contact/information";
import { Header } from "~/components/page-header.client";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Get in Touch"
        description="Have a question or want to work together? I'd love to hear from you."
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <section className="grid items-start gap-12 md:grid-cols-2">
          <ContactInformation />
          <ContactForm />
        </section>
        <section className="mt-24" id="faqs">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about courses, platform, and
              services.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-3 text-xl font-bold">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll in a course, simply navigate to the course page and click the 'Enroll Now' button. You'll be prompted to create an account or sign in if you already have one, and then you can complete the enrollment process.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "No, I do not offer refunds as this platform operates on a subscription basis. However, you can cancel your subscription at any time before the next billing cycle.",
  },
  {
    question: "How long do I have access to a course?",
    answer:
      "You retain access to a course only while your subscription is active. If your subscription ends, you will lose access to locked materials, but any content you’ve already unlocked will remain available.",
  },
  {
    question: "Do you offer certificates of completion?",
    answer:
      "Yes, upon completing a course, you'll receive a certificate of completion that you can share on your resume or LinkedIn profile.",
  },
  {
    question: "Can I download course videos for offline viewing?",
    answer:
      "No, downloading course videos is not permitted. All content must be accessed through our platform.",
  },

  {
    question: "Can I hire you to work on a project?",
    answer:
      "Yes, I’m available for hire as a senior fullstack developer or technical consultant for projects. You can checkout my techstack and feel free to contact.",
  },
  {
    question:
      "Can I contribute to an article, tutorial, or course on this website?",
    answer:
      "Articles or Tutorials are not accepted as this is my personal website. However, if you'd like to contribute written content for courses, you may reach out to me—though contributors do not receive public credit.",
  },
  {
    question:
      "What technology stack powers this website, and is the code open source?",
    answer:
      "The full tech stack is detailed on my About page. While the code isn't open source, I've written a detailed explanation in my post 'Why Coding Simba Isn't Open Sourced' that covers the reasoning behind this decision. For specific technical questions, feel free to reach out!",
  },
];
