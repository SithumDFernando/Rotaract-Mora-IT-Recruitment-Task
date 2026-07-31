# Phase 1 — Project Scaffolding, Backend Service & Database Setup
- [x] Initialize Next.js project
- [x] Update `.gitignore`
- [x] Implement Design System (`globals.css`, `layout.tsx`)
- [x] Setup Backend Service (`.env.local`, `.env.example`)
- [x] Create Database Migrations & Seed Data (`supabase/migrations`, `supabase/seed.sql`)
- [x] Setup Supabase Client Layer (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`)
- [x] Create Shared Types & Constants (`src/lib/types.ts`, `src/lib/constants.ts`, `src/lib/utils.ts`)

# Phase 2 — Core Booking Logic (Server Actions)
- [ ] Implement `getBookings` server action
- [ ] Implement `createBooking` server action (with overlap prevention)
- [ ] Implement `updateBooking` server action
- [ ] Implement `deleteBooking` server action
- [ ] Create API Route as fallback (`src/app/api/bookings/route.ts`)

# Phase 3 — UI Components
- [ ] Create Reusable UI Primitives (`Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`, `Select.tsx`, `Toast.tsx`, `Modal.tsx`)
- [ ] Implement `BookingForm.tsx` (Create & Edit modes)
- [ ] Implement `TimeSlotGrid.tsx`
- [ ] Implement `BookingList.tsx`
- [ ] Implement `CalendarView.tsx`
- [ ] Implement `FilterBar.tsx`

# Phase 4 — Main Page Assembly & Loading States
- [ ] Assemble `page.tsx`
- [ ] Implement `loading.tsx`

# Phase 5 — Polish, CI/CD & Deployment
- [ ] Add micro-animations and accessibility features
- [ ] Create CI Pipeline (`.github/workflows/ci.yml`)
- [ ] Verify deployment process
- [ ] Write `README.md`
