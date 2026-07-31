# Time Slot Booking Dashboard

A premium, responsive, and robust time slot booking application built with Next.js 15, Tailwind CSS v4, and Supabase.

## ✨ Features

- **Modern UI/UX**: Premium aesthetic with micro-animations, glassmorphism, and responsive layouts.
- **Robust Booking System**: 30-minute time slots (8:00 AM - 10:00 PM) with 3 layers of overlap prevention (Client UI, Server Actions, PostgreSQL Exclusion Constraints).
- **CRUD Functionality**: Create, Read, Update, and Delete bookings with ease.
- **Interactive Calendar**: Custom month-view calendar with indicator dots for days that have bookings.
- **Dynamic Filtering**: Client-side searching by name/note and filtering by category.
- **Optimistic/Fast Updates**: Built with Next.js Server Actions for seamless client-server communication.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Types**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SithumDFernando/Rotaract-Mora-IT-Recruitment-Task.git
cd "Recruitment Task"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project in [Supabase](https://supabase.com/).
2. Go to the SQL Editor and run the migration and seed scripts located in `supabase/migrations/001_create_bookings_table.sql` and `supabase/seed.sql`.
3. _(Optional)_ To bypass Row Level Security for testing, run: `ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Deploy!

## 🧪 CI/CD

This project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically installs dependencies, lints the code, and builds the Next.js application on every push to the `main` branch.

---

made by Sithum Dulain Fernando
