import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BackToProductButtonProps } from "@/shared/types/product";
import { Button } from "@/shared/components/Button";

function BackToProductButton({ className = '', href = "/shop" }: BackToProductButtonProps) {
  return (
    <Button
      href={href}
      variant="secondary"
      className={`w-full hover:text-black ${className}`}
      aria-label="Back to products"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" aria-hidden="true" />
      Back To Products
    </Button>
  );
}

export default BackToProductButton;