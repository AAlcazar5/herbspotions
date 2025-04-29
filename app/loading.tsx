// app/loading.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-primary">
      <FontAwesomeIcon
        icon={faFlask} 
        className="h-24 w-24 animate-spin mb-4"
        aria-hidden="true"
      />
      <p className="text-lg font-semibold">Loading...</p>
       <span className="sr-only">Loading page content</span>
    </div>
  );
}
