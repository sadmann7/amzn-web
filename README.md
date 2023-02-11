# [Amzn Store](https://amzn-web.vercel.app/)

This project is an Amazon clone bootstrapped with the [T3 Stack](https://create.t3.gg/).

[![Amzn Store](./public/screenshot.png)](https://amzn-web.vercel.app/)

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Cloudinary](https://cloudinary.com)
- [Stripe](https://stripe.com)

## Features

- Authentication with NextAuth.js
- CRUD operations with tRPC and Prisma
- Search products with combobox
- Add to cart, and proceed to orders
- Image upload with Cloudinary
- Subscription with Stripe

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sadmann7/amzn-web.git
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and add the environment variables as shown in the `.env.example` file.

### 4. Run the application

```bash
yarn run dev
```

The application will be available at `http://localhost:3000`.

## Deployment

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
