import { motion } from "framer-motion";
import { ContactForm } from "~/components/contact/form";
import { ContactInformation } from "~/components/contact/information";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gray-100/30 py-24 dark:bg-gray-800/10"
    >
      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Get In Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Have a question or want to get in touch? Leave us a message!
          </p>
        </motion.div>

        <div className="grid items-start gap-12 md:grid-cols-2">
          <ContactInformation />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
