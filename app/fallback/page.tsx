import { NextPage } from "next";
import React from "react";

const FallbackPage: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:py-20 px-6 lg:px-8 bg-background dark:bg-background text-foreground dark:text-foreground">
      <div className="mb-8 w-36 h-36 relative overflow-hidden">
        <img
          src="/assets/hpLogo.webp"
          alt="Herbs & Potions logo"
          className="object-contain w-full h-full absolute top-0 left-0"
        />
      </div>

      <div className="mb-4 text-center text-2xl font-bold text-foreground dark:text-foreground">
        <h1>No Internet Connection</h1>
      </div>

      <div className="mb-3 text-center text-xl font-semibold text-foreground dark:text-foreground">
        <h2>Try:</h2>
      </div>

      <div className="mb-10">
        <ul className="list-disc text-muted-foreground dark:text-muted-foreground text-lg pl-5">
          <li className="mt-1">Reconnecting to Wi-Fi</li>
          <li className="mt-1">
            Checking the network cables, modem and router
          </li>
          <li className="mt-1">Turning on Mobile Data instead of Wi-Fi</li>
        </ul>
      </div>
    </div>
  );
};

export default FallbackPage;