import { NextPage } from "next";
import React from "react";
import { Button } from "@/shared/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const RequestSuccessPage: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 lg:py-24 bg-background dark:bg-background text-foreground dark:text-foreground px-6 lg:px-8">
      <div className="mb-8 w-36 h-36 relative overflow-hidden">
        <img
          src="/assets/hpLogo.webp"
          alt="Herbs & Potions logo"
          className="object-contain w-full h-full absolute top-0 left-0"
        />
      </div>

      <div className="relative z-0 container max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-wide mb-8 lg:mb-12 uppercase">
          Request Success!
        </h2>
        <div className="mb-6">
          <p className="text-lg text-muted-foreground dark:text-muted-foreground">
            Your return request has been submitted. More details will be sent
            to your receipt email shortly. Thank you for shopping with us and
            funding our sustainable future!
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <Button
             href="/shop"
             variant="primary"
             className="font-bold py-3 px-6 text-base"
           >
             <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4 mr-2" aria-hidden="true" />
             Continue Shopping
           </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccessPage;