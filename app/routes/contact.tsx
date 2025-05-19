import { ContactForm } from "~/components/contact/form";
import { ContactInformation } from "~/components/contact/information";
import { Header } from "~/components/page-header";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Get in Touch"
        description="Have a question or want to work together? I'd love to hear from you."
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <ContactInformation />
          <ContactForm />
        </div>
        <div className="mt-24">
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
            {[
              {
                question: "How do I enroll in a course?",
                answer:
                  "To enroll in a course, simply navigate to the course page and click the 'Enroll Now' button. You'll be prompted to create an account or sign in if you already have one, and then you can complete the enrollment process.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee for all our courses. If you're not satisfied with a course, you can request a refund within 30 days of purchase.",
              },
              {
                question: "How long do I have access to a course?",
                answer:
                  "Once you enroll in a course, you have lifetime access to the course materials, including any future updates.",
              },
              {
                question: "Do you offer certificates of completion?",
                answer:
                  "Yes, upon completing a course, you'll receive a certificate of completion that you can share on your resume or LinkedIn profile.",
              },
              {
                question: "Can I download course videos for offline viewing?",
                answer:
                  "Yes, our premium subscribers can download course videos for offline viewing through our mobile app.",
              },
              {
                question: "Do you offer team or enterprise plans?",
                answer:
                  "Yes, we offer team and enterprise plans for organizations looking to train multiple employees. Please contact our sales team for more information.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-3 text-xl font-bold">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
