"use client";

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/shared/components/Button';

const LOCAL_STORAGE_KEY = 'ageVerified';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setIsCheckComplete(true);
      return;
    }
    try {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedValue !== 'true') {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Age Gate: Error accessing localStorage", error);
    } finally {
       setIsCheckComplete(true);
    }
  }, []);

  const handleConfirmAge = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    } catch (error) {
       console.error("Age Gate: Error setting localStorage", error);
    }
    setIsOpen(false);
  };

  const handleDenyAge = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isCheckComplete && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background dark:bg-card p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-foreground dark:text-foreground text-center"
                >
                  Age Verification
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground text-center">
                    Please confirm you are 21 years of age or older to access this site.
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                <Button
                    className="text-background cursor-pointer"
                    variant="primary"
                    onClick={handleConfirmAge}
                  >
                    I am 21 or Older
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    onClick={handleDenyAge}
                  >
                    I am Under 21
                  </Button>
                 
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}