import React from 'react';
import BackToPostButton from "@/blog/components/BackToPostButton";
import PostInfo from "@/blog/components/PostInfo";
import { PostSectionProps } from "@/shared/types/blog";
import { FC } from "react";

const PostDetails: FC<PostSectionProps> = ({ postData }) => {

  if (!postData) {
    return (
      <div className="flex justify-center items-center flex-grow max-w-6xl mx-auto py-8 sm:py-12 md:px-8">
        <div className="text-center text-destructive-500 dark:text-destructive-500 p-10">
          Error: Could not load post details.
        </div>
      </div>
    );
  }

  const { title, image, contentHtml, publishedAt } = postData;

  return (
    <div className="flex flex-col items-stretch w-full max-w-6xl mx-auto py-8 sm:py-12 md:px-8">
      <div className="w-full max-w-prose mx-auto mb-6 md:mb-8">
        <BackToPostButton href="/blog" />
      </div>

      <div className="w-full max-w-prose mx-auto">
         <PostInfo
            title={title || ""}
            image={image ?? null}
            contentHtml={contentHtml || ""}
            publishedAt={publishedAt}
         />
      </div>

    </div>
  );
}

export default PostDetails;