import { NextPage } from "next";
import FaqAccordion from "./components/FaqAccordion";
import React from "react";

const FaqPage: NextPage = () => {
  return (
    <div className="w-full min-h-screen bg-background dark:bg-background">
      <FaqAccordion />
    </div>
  );
};

export default FaqPage;