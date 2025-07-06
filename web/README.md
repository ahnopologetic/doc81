# Doc81 Web Interface

This is the web interface for Doc81, a documentation platform that helps you build your knowledge on top of established building blocks.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Setup

This project uses Supabase for authentication. To set up authentication:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Create a `.env.local` file in the root of the web directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Replace `your-supabase-project-url` and `your-supabase-anon-key` with your actual Supabase project URL and anon key.
4. You can find these values in your Supabase project dashboard under Project Settings > API.
5. In your Supabase project, go to Authentication > URL Configuration and add the following URL to the site URL and redirect URLs:
   ```
   http://localhost:3000
   http://localhost:3000/auth/callback
   ```

## Features

- **Authentication**: Sign up, sign in, and user profile management using Supabase Auth
- **Templates**: Browse and use documentation templates
- **MCP Integration**: Use the MCP feature for advanced documentation

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
