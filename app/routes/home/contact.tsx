import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Github, Mail, User } from "lucide-react";
import { ContactForm } from "~/components/contact-form";

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
            Have a question or want to get in touch? Drop me a message!
          </p>
        </motion.div>

        <div className="grid items-start gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
            <div className="space-y-6">
              <ContactElement
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                href="mailto:hello@codingsimba.com"
              >
                hello@codingsimba.com
              </ContactElement>
              <ContactElement
                icon={<Github className="h-5 w-5" />}
                label="GitHub"
                href="https://github.com/christophersesugh"
              >
                github.com/christophersesugh
              </ContactElement>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Social Media</h4>
                  <div className="mt-2 flex gap-4">
                    <ContactLink href="#">X (Formerly Twitter)</ContactLink>
                    <ContactLink href="#">LinkedIn</ContactLink>
                    <ContactLink href="#">YouTube</ContactLink>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type ContactLinkProps = {
  href: string;
  children: React.ReactNode;
};

type ContactElementProps = ContactLinkProps & {
  label: string;
  icon: React.ReactNode;
};

function ContactElement({ icon, href, label, children }: ContactElementProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h4 className="mb-1 font-medium">{label}</h4>
        <ContactLink href={href}>{children}</ContactLink>
      </div>
    </div>
  );
}

function ContactLink({ href, children }: ContactLinkProps) {
  return (
    <Link
      to={href}
      target="_blank"
      prefetch="intent"
      className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}
