import React from 'react';

interface PageTitleProps {
    text: string;
  }

const PageTitle: React.FC<PageTitleProps> = ({ text }) => {
  return (
    <h1 className="text-center text-3xl font-semibold tracking-wide my-8 lg:my-12 uppercase text-foreground dark:text-foreground">
      {text}
    </h1>
  );
}

export default PageTitle;