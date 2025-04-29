# Herbs & Potions - Next.js Shopify Storefront

A modern, headless e-commerce storefront built with Next.js, TypeScript, and Tailwind CSS, using the Shopify Storefront API as the backend for products, cart management, blog content, and as a headless CMS.

## Overview

This project serves as the customer-facing frontend for Herbs & Potions. It fetches product and content data directly from Shopify via its Storefront API, offering a fast, customizable user experience built with modern web technologies. It includes essential e-commerce features, a blog, content pages, and robust client-side functionality.

![Homepage Screenshot](public/screenshots/lighthouse-perfect-scores.png)
![Shop Page Screenshot](public/screenshots/light-mode.png)
![Product Detail Screenshot](public/screenshots/dark-mode.png)
![Blog Page Screenshot](public/screenshots/products-page.png)
![Mobile Menu Screenshot](public/screenshots/cart.png)

## Features

* **Framework:** Built with [Next.js](https://nextjs.org/) (App Router) for server-side rendering, static site generation, and client-side navigation.
* **Language:** Written in [TypeScript](https://www.typescriptlang.org/) for type safety and improved developer experience.
* **Headless Shopify:** Uses the [Shopify Storefront API](https://shopify.dev/docs/api/storefront) to fetch:
    * Products (listings, details, variants)
    * Collections
    * Blog Posts & Articles
    * Handles Cart creation and updates (or uses local storage for demo).
* **Styling:** Styled with [Tailwind CSS](https://tailwindcss.com/) utility classes.
* **UI Components:**
    * Custom reusable components, some of them using [shadcn/ui](https://ui.shadcn.com/).
    * Mobile navigation drawer implemented using [Headless UI](https://headlessui.com/) Dialog & Transition for CSP compliance.
* **Content Pages:** Includes Homepage, Shop (All Products), Product Detail Pages, Blog (All Posts), Blog Post Pages, Contact, FAQ.
* **E-commerce:**
    * Product Browse and filtering (example shows filtering by Tag on Shop page).
    * Client-side cart management using React Context.
* **Themeing:** Light/Dark mode toggle support (likely using `next-themes`).
* **Icons:** Uses [Font Awesome](https://fontawesome.com/) and [Lucide React](https://lucide.dev/) icons.
* **Age Gate:** Production-only modal requiring age verification (21+) for new visitors, using `localStorage`.
* **Accessibility:** Focus on accessible components (inherent in libraries like Headless UI).

## Tech Stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Primitives/Components:** React, Headless UI, Lucide React
* **Icons:** Font Awesome
* **Backend/CMS:** Shopify Storefront API (GraphQL)
* **State Management:** React Context API, React Hooks (`useState`, `useEffect`, `useRef`)
* **Package Manager:** npm or yarn

## Getting Started

### Prerequisites

* Node.js (v18.x or later recommended)
* npm or yarn
* Access to a Shopify store with the Storefront API enabled.
* Shopify Storefront API Access Token (Public) with necessary permissions (read products/content, write checkouts).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project. Add the necessary Shopify credentials and other environment variables. See the `.env.example` file (if provided) or the section below for required variables.

### Environment Variables

Create a `.env.local` file in the project root and add the following variables:

```plaintext
# Required: Your Shopify store domain (e.g., your-store-name.myshopify.com)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com

# Required: Your PUBLIC Storefront API access token (create via Shopify Admin > Apps > Develop apps > Create app)
# Ensure this token has permissions for products, collections, cart/checkouts (write), blog posts etc.
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_public_storefront_api_token

# Required: Your site's full production URL (used for metadataBase)
NEXT_PUBLIC_SITE_URL=[https://yoursite.com](https://yoursite.com)

Important: Ensure your Storefront API access token has the necessary permissions (e.g., unauthenticated_read_product_listings, unauthenticated_read_content, unauthenticated_write_checkouts, etc.) configured in your Shopify custom app settings.
Using Your Own Shopify Data (Products & Posts)

This template uses placeholder static data for products and blog posts by default (e.g., in data/demoProducts.ts, data/demoPosts.ts), primarily for demo purposes. This data is structured as arrays of objects.

You have two main options to use your own data:

1. Fetch Live Data from Shopify API (Recommended for Production):

    Ensure your .env.local variables are correctly set up (see above).
    Modify the data fetching functions (likely located in lib/shopifyProducts.ts and lib/shopifyPosts.ts) to actively fetch data using the Shopify Storefront API client with the configured credentials instead of importing static data.
    Update any components or pages that currently import static placeholder data to use these live fetching functions.

2. Replace Placeholder Static Data:

    Locate the placeholder data files (e.g., data/demoProducts.ts and data/demoPosts.ts).
    Replace the placeholder content with your actual product and post data, maintaining the exact same object structure and property names. Update image paths.
    Rename the files (e.g., demoProducts.ts to products.ts) or update the import paths in lib/shopifyProducts.ts / lib/shopifyPosts.ts accordingly.

Enabling Live Shopify Cart & Checkout

By default, the cart uses local storage only for demo purposes. To enable full Shopify checkout functionality:

    Modify StoreContext.tsx:
        This file contains blocks of code commented out and labeled --- START: Logic for Live Shopify Shop --- and active code labeled --- START: Logic for Demo Purposes ---.
        Uncomment all the blocks related to "Live Shopify Shop" (Imports, State variables checkoutId/checkoutUrl, useEffect hooks, Shopify data functions, Shopify Context Provider structure).
        Comment Out all the blocks related to "Demo Purposes" (Demo data functions, Demo Context Provider structure).
        Update the CartContextType definition near the top to include the checkoutUrl string again: type CartContextType = [CartItem[], string, boolean] | undefined;
        Update the useCartContext hook's return type annotation to match: export function useCartContext(): [CartItem[], string, boolean]

    Modify CartPage.tsx (or other components using cart context):
        Find the "Checkout" button section.
        Comment out the "Demo Version" button block (the one using onClick={openCheckoutModal}).
        Uncomment the "Live Version" button block (the one using href={checkoutUrl}).
        Update the useCartContext destructuring at the top of the component to include checkoutUrl: const [cart, checkoutUrl, isLoading] = useCartContext();.
        Check any other components that use useCartContext and ensure they correctly destructure the expected values (cart, checkoutUrl, isLoading).

    Test Thoroughly: After making these changes, test adding items to the cart, updating quantities, and proceeding to the Shopify checkout via the button on the cart page.

Usage
Running the Development Server
Bash

npm run dev
# or
yarn dev

Open https://www.google.com/search?q=http://localhost:3000 with your browser to see the result. The application will automatically reload upon code changes. The Age Gate modal will be skipped in development mode.  

Building for Production
Bash

npm run build
# or
yarn build

This command builds the application for production usage, generating static files and serverless functions.
Running the Production Build Locally

To test the production build on your local machine:
Bash

npm run start
# or
yarn start

This serves the optimized production build from the .next folder. Open https://www.google.com/search?q=http://localhost:3000. The Age Gate modal will be active in this mode.
Deployment

Deploy the application to a platform that supports Next.js (like Vercel, Netlify, AWS Amplify, etc.). Ensure you configure the required Environment Variables (Shopify domain and Storefront token) in your hosting provider's settings. Vercel is recommended for seamless Next.js deployments.