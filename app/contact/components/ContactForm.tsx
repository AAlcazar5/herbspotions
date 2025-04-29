"use client";

import { FC, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as yup from "yup";
import { Button } from '@/shared/components/Button';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
  });

  const handleSubmit = async (values: ContactFormValues, { resetForm }: { resetForm: () => void }) => {
    setSubmissionStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSubmissionStatus("success");
        resetForm();
        setTimeout(() => setSubmissionStatus("idle"), 4000);
      } else {
        setSubmissionStatus("error");
         setTimeout(() => setSubmissionStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSubmissionStatus("error");
      setTimeout(() => setSubmissionStatus("idle"), 5000);
    }
  };

  const inputClasses = `
    block w-full rounded-md py-3 px-3 leading-5 border transition-colors duration-150 ease-in-out
    bg-input dark:bg-input
    text-foreground dark:text-foreground
    placeholder:text-muted-foreground dark:placeholder:text-muted-foreground
    border-border dark:border-border
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
  `;

  return (
    <div className="bg-card dark:bg-card p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl">
     <h2 className="text-center text-3xl font-bold tracking-tight text-foreground dark:text-foreground mb-3">
        Contact Us<span className="ml-2">📩</span>
     </h2>
      <p className="text-center text-muted-foreground dark:text-muted-foreground mb-8">
        Feel free to reach out with any questions! 👋
      </p>

      <Formik
        initialValues={{ name: "", email: "", message: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Name</label>
            <Field
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              className={inputClasses}
            />
            <ErrorMessage name="name" component="div" className="text-destructive-500 dark:text-destructive-500 text-xs mt-1" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Email</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className={inputClasses}
            />
            <ErrorMessage name="email" component="div" className="text-destructive-500 dark:text-destructive-500 text-xs mt-1" />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Message</label>
            <Field
              as="textarea"
              name="message"
              id="message"
              rows={4}
              placeholder="How can we help?"
              className={inputClasses}
            />
            <ErrorMessage name="message" component="div" className="text-destructive-500 dark:text-destructive-500 text-xs mt-1" />
          </div>

          <div className="pt-2 flex justify-center">
            <Button
                type="submit"
                variant="primary"
                disabled={submissionStatus === "loading"}
                className="w-full sm:w-1/2 text-lg px-4 font-bold cursor-pointer dark:bg-green-300 dark:text-black"
            >
                {submissionStatus === "loading" ? "Submitting..." : "Submit"}
            </Button>
          </div>

          <div className="h-6 text-center mt-4">
            {submissionStatus === "success" && (
              <div className="text-green-500 dark:text-green-300 font-medium">Message sent successfully!</div>
            )}
            {submissionStatus === "error" && (
              <div className="text-destructive-500 dark:text-destructive-500 font-medium">Failed to send message. Please try again.</div>
            )}
          </div>

        </Form>
      </Formik>
    </div>
  );
};

export default ContactForm;