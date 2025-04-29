import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BackToPostButtonProps } from "@/shared/types/blog";
import { Button } from "@/shared/components/Button";
import { FC } from "react";

const BackToPostButton: FC<BackToPostButtonProps> = ({ className = '', href = "/blog" }) => {
  return (
    <Button
      href={href}
      variant="secondary"
      className={`w-full dark:text-green-300 dark:hover:text-black ${className}`}
      aria-label="Back to blog posts"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" aria-hidden="true" />
      Back To Blog Posts
    </Button>
  );
}

export default BackToPostButton;