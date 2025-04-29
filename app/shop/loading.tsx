import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-primary">
        <FontAwesomeIcon
          icon={faFlask}
          className="h-24 w-24 animate-spin mb-4"
          aria-hidden="true" 
        />
        <p className="text-lg font-semibold">Loading...</p>
        <span className="sr-only">Loading shop products</span>
      </div>
    </div>
  );
}
