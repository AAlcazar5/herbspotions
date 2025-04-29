"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const previousPath = useRef(pathname + searchParams.toString());

  const finishTimeout = useRef<NodeJS.Timeout | null>(null);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);
  const startDelayTimeout = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    const hasNavigated = currentPath !== previousPath.current;

    if (startDelayTimeout.current) clearTimeout(startDelayTimeout.current);
    if (finishTimeout.current) clearTimeout(finishTimeout.current);
    if (resetTimeout.current) clearTimeout(resetTimeout.current);

    if (hasNavigated) {
      console.log(`Navigation detected: ${previousPath.current} -> ${currentPath}`);
      startDelayTimeout.current = setTimeout(() => {
        console.log('>>> Setting isLoading = true (Start Delay Timeout) <<<');
        setIsLoading(true);
        setIsFinished(false);
        previousPath.current = currentPath;
      }, 100);
    }

    return () => {
      console.log("Effect Cleanup Running");
      if (startDelayTimeout.current) {
        console.log("Cleanup: Clearing pending start timeout");
        clearTimeout(startDelayTimeout.current);
      }

      if (isLoading) {
        console.log("Cleanup: Starting finish sequence (isLoading was true).");
        setIsFinished(true);

        finishTimeout.current = setTimeout(() => {
          console.log('<<< Setting isLoading = false (Finish Timeout) <<<');
          setIsLoading(false);
          resetTimeout.current = setTimeout(() => {
              console.log("Resetting isFinished state");
              setIsFinished(false);
          }, 100);
        }, 600);
      } else {
           console.log("Cleanup: isLoading was false, doing nothing.");
      }
    };
  }, [pathname, searchParams]);

  const loadingBarClass = `loading-bar ${isLoading ? 'is-loading' : ''} ${isFinished ? 'is-finished' : ''}`;
  console.log('Applying classes:', loadingBarClass);

  return <div className={loadingBarClass} />;
}