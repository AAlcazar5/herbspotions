import ContactForm from "@/contact/components/ContactForm";
import React from "react";

const Contact = () => { 
  return (
    <div className="w-full min-h-screen bg-background dark:bg-background py-16 sm:py-24 px-4">
      <div className="flex justify-center items-start">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;