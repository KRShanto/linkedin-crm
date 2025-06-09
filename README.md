# LinkedIn CRM

A modern CRM system for managing LinkedIn connections and prospects.

## Features

- 📊 Contact Management with optimistic updates
- 🖼️ Profile image storage and automatic cleanup
- 🔄 Real-time UI updates using React 19's optimistic features
- 📱 Responsive design with dark/light mode
- 🗄️ Supabase backend integration

## Setup

1. **Environment Variables**

   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for file deletion functionality. Without it, profile images won't be cleaned up when contacts are updated or deleted.

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

## File Management

The system automatically handles Supabase storage cleanup:

- ✅ **When adding a contact**: Profile images are downloaded and stored in Supabase storage
- ✅ **When updating a contact**: Old profile images are deleted when new ones are uploaded
- ✅ **When deleting a contact**: Profile images are automatically removed from storage
- ✅ **Error handling**: If database operations fail, uploaded images are cleaned up

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Storage + Edge Functions)
- **State Management**: React 19's `useOptimistic` and `useTransition`
- **UI Components**: Custom components with Radix UI primitives

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
