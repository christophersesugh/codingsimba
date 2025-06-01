import React from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";

const ContactFormSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  subject: z
    .string({ required_error: "Subject is required" })
    .min(5, "Subject must be atleast 5 characters"),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Message must be atleast 10 characters"),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactFormSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="mb-6 text-2xl font-bold">Leave a message</h2>

      <form
        ref={formRef}
        {...getFormProps(form)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action={`https://formsubmit.co/4e6d736d95b932b2d66e894716711b8e`}
        method="POST"
        className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-gray-900"
      >
        {/* <input
          type="hidden"
          name="_next"
          value="http://localhost:5173/contact/success"
        /> */}
        {/* <input
          type="hidden"
          name="_webhook"
          value="https://codingsimba.com/contact/webhook"
        /> */}
        {/* <input type="hidden" name="_cc" value="christohybrid185@gmail.com" /> */}
        <input type="hidden" name="_captcha" />
        <input type="text" name="_honey" style={{ display: "none" }} />

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fields.name.id}>Name</Label>
              <Input
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                placeholder="john@doe.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fields.subject.id}>Subject</Label>
            <Input
              {...getInputProps(fields.subject, { type: "text" })}
              name="_subject"
              placeholder="How can I help you?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fields.message.id}>Message</Label>
            <Textarea
              {...getTextareaProps(fields.message)}
              placeholder="Your message here..."
              name="message"
              rows={5}
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              setIsSubmitting(true);
              formRef.current?.submit();
              setIsSubmitting(false);
            }}
            className="w-full"
          >
            Send Message{" "}
            {isSubmitting ? <Loader2 className="ml-1 animate-spin" /> : null}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
