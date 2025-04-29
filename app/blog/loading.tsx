import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-primary">
        <FontAwesomeIcon
          icon={faFlask}
          className="h-12 w-12 animate-spin mb-4"
          aria-hidden="true"
        />
        <p className="text-lg font-semibold">Loading...</p>
        <span className="sr-only">Loading blog posts</span>
      </div>
    </div>
  );
}
