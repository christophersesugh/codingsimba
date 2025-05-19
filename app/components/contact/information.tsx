import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, User } from "lucide-react";
import { Link } from "react-router";
import { social } from "~/constants/navlinks";

export function ContactInformation() {
  return (
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
          href="mailto:me@codingsimba.com"
        >
          me@codingsimba.com
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
            <div className="mt-2 flex flex-col gap-4">
              {social
                .filter((i) => i.name !== "github")
                .map((item) => (
                  <ContactLink key={item.name} href={item.path}>
                    {item.name}
                  </ContactLink>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
