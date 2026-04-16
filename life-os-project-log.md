# Life OS: Project Conversation Log
### From concept to deployed app
### Date: April 2026

---

## 1. THE PROBLEM

Adulting requires a massive amount of shared knowledge, context, and ongoing admin. Weekly tasks, monthly tasks, annual tasks, all stored across multiple systems with no single source of truth. The "glue" between everything is memory.

### Pain points identified:
- **Fragmented info** — shared calendar, Apple Notes, Excel, whiteboard, heads. Nothing talks to anything else.
- **No "when is this due next" engine** — recurring stuff relies on memory until it's urgent
- **Ownership is implicit** — who does what isn't written down
- **Context is scattered** — provider numbers, policy details, kids' sizes, booking links all in different places
- **Ambient anxiety** — the nagging feeling that something's slipping, that you can't see the full picture
- **No survivability** — if something happened to either person, nobody could pick up the manual because the manual doesn't exist

### Core insight:
This isn't a to-do list problem. It's an **ambient anxiety** problem. The system needs to make life feel *handled*, not add another thing to maintain.

### Job to be done:
"I want to feel like my life admin is handled, visible, and survivable — not just by me, but by anyone who'd need to pick it up."

---

## 2. THE ARCHITECTURE

Three layers:

### Layer 1: The Registry
Everything that exists and recurs, with ownership, timing, and context attached. Life has "assets" that need maintenance: cars, teeth, passports, relationships with service providers, financial accounts, insurance policies, kids' school stuff. Each one has a rhythm, an owner, key info, and a "what to do" attached.

### Layer 2: The Dashboard
What's coming, what's overdue, what's this week. The thing that replaces the whiteboard, the mental load, and the 3am worry. Scannable in 15 seconds.

### Layer 3: The Manual
The "if I get hit by a bus" document. A living document that stays current because it's just a view of the registry, not a separate thing to maintain.

**The magic:** Layer 3 isn't extra work. If the registry is good, the manual writes itself.

---

## 3. THE REGISTRY MAP

### 🏠 Home & Property
- Cleaning (Mon/Wed/Thu) — Thandi
- Garden service (weekly) — Cameron owns
- Pool service (weekly) — Cameron owns
- Aircon servicing (annually)
- Vacuum/appliance filters
- Plumber, electrician, handyman (ad hoc + contacts)
- WiFi/internet — Cameron
- Solar system — Cameron
- Home insurance, rates/levies, alarm/security

### 🏘️ Rental Properties (x2, Cape Town)
- Tenant management, lease renewals
- Maintenance/repairs
- Rates, levies, insurance
- Rental income tracking

### 🚗 Vehicles
- Car licence disk renewals — Chloë
- Annual services + service books
- Insurance, warranty/service plan expiry
- Registration details, VIN numbers

### 👦 Tom (13) & Luke (11)
- Custody calendar (week on, week off — Newlands / Kommetjie)
- School terms, holidays, schedules
- Uniforms (sizes, suppliers) + non-uniform clothing sizes + shoe sizes
- Daily lunches, weekly meal planning
- Extra lessons (school + sport) — scheduling and payment
- Extracurriculars (Tom: extra maths Tue, Luke: cricket Sat)
- Pick-up schedule (JP/Patrick 3-4 days/week)
- School fees/payments
- Medical info per child
- Kids' social calendar
- Kids' documents (SA, NZ, UK, Finnish passports per child)

### 🩺 Health (per person: Chloë, Cameron)
- GP / annual check-up
- Bi-annual blood tests
- Dentist (annual)
- Oral hygienist (twice yearly)
- Mole mapping (annual)
- Pap smear (every 2 years — Chloë)
- Optometrist
- Prescriptions/chronic meds
- Medical aid details + cards
- Exercise schedule/gym

### 💰 Finance & Legal — Shared
- Monthly household budget (shared Excel)
- Wills (both, when last updated)
- Joint accounts/investments
- Medical aid, short-term insurance, life/income protection
- Cameron's mom's cleaner payment

### 💰 Finance & Legal — Chloë
- UK tax filing (+ advisor James)
- SA financial advisor (Mark at Dovetail)
- Bank accounts, investments
- SpeakSoon / Plentii / Clear Angle financials

### 💰 Finance & Legal — Cameron
- His tax/financial obligations
- Bank accounts, investments

### 📄 Identity & Documents
- Chloë: SA + UK passports
- Cameron: SA + UK + NZ passports
- Kids: SA + NZ + UK + Finnish passports (each)
- IDs, drivers licences, birth certificates, marriage certificate
- Expiry dates + renewal lead times

### ✈️ Travel
- Shared travel schedule (every 4-6 weeks)
- Chloë solo work travel
- Cameron solo work travel
- Travel insurance, visa requirements, loyalty programmes

### 💳 Subscriptions & Memberships
- Streaming, software/SaaS, gym/fitness, club memberships

### 🚲 Equipment
- Bikes (Chloë road bike, Cameron MTB)
- SUPs (2x boards)
- Service schedules

### 🔌 Appliances
- Fridge, washing machine, oven, etc.
- Brand, model, purchase date
- Warranty expiry, service schedules
- Receipts and warranty cards

### 👥 Relationships & Social
- Birthdays (family + close friends)
- Anniversaries/special occasions
- Shared social calendar
- Gift tracking

### 🍽️ Meal Planning & Groceries
- Weekly dinner plan with who's cooking
- Shopping list by aisle (Fruit+Veg, Dairy, Meat, Bread, Dry, Toiletries, Household, Other)
- Monthly supplies list
- Ad hoc "to buy" list

### 🆘 Emergency / "If I Die" Manual
- Key contacts, document locations, password manager
- What recurs, who owns it, how to do it
- Kids' routines, school, medical, pick-ups
- Insurance claim processes, rental property handover

### Key people in the system:
- Chloë, Cameron, Tom, Luke
- JP & Patrick (pick-ups)
- Cameron's mom (cleaner payment)
- UK tax advisor (James), SA financial advisor (Mark)
- Thandi (cleaner), Green Fingers (garden), Pool Pro, Cape Aircon
- Dave (plumber), various doctors/dentists

---

## 4. DESIGN DECISIONS

### What makes this something you actually open daily:
1. **Shows you something useful without asking** — a status board, not a to-do list
2. **Dead simple to update** — under 10 seconds for any action
3. **Rewards you** — visual signal that things are on track, not screaming about what's overdue

### Language reframe:
- "Overdue" → **"Needs love 💛"** — warmer, less stressful
- "Due soon" → **"Heads up 👀"** — a nudge, not a nag
- "On track" → **"Handled ✓"** — feels good

### Score decision:
Removed the numeric score (74/100 etc.) because it would be stress-inducing when it dips. Replaced with three simple counts (handled / heads up / need love) and a gentle one-liner ("Almost there 👊", "Everything's humming ✨").

### Colour scheme:
- Chloë: **Royal blue** (#3366CC)
- Cameron: **Teal** (#2AA198)
- Together: **Purple** (#8B6CC1)
- Kids: **Gold** (#E5A100)
- House: **Grey** (#9CA3AF)
- Needs love: **Coral** (#E06856)
- Heads up: **Purple** (#8B6CC1)
- Handled: **Sage green** (#3DA07A)
- Background: Light cool grey (#F4F6F8)

### Custody strip:
- Runs **Sunday to Sunday** (full week including handover day)
- Newlands (NWL) = royal blue filled
- Kommetjie (KOM) = unfilled/grey
- Shows this week and next week side by side
- Synced from Google Sheet

### Navigation:
Four tabs: **📋 Today | 🛒 Lists | 🗄️ Registry | 📖 Manual**

### Today view order:
1. Status summary (handled/heads up/need love counts)
2. Boys custody strip (this week + next week)
3. This week schedule (colour-coded tags)
4. Next week schedule (collapsed by default)
5. Needs love items
6. Heads up items

### Lists tab:
- Dinner this week (editable meals + editable cook assignment)
- Weekly shopping by aisle
- Monthly supplies
- To Buy (ad hoc)

### Registry:
- Grid of categories with status indicators
- Each item expandable with: notes, details (editable), contacts (tap-to-call), documents, links
- Edit button turns fields into editable inputs
- Done and Snooze buttons
- 🤖 Agent action buttons (Phase 2: "Book appointment", "Schedule call", etc.)

---

## 5. TECH STACK

| Tool | Purpose |
|------|---------|
| **Next.js** (React) | Frontend framework |
| **Supabase** | Database + authentication |
| **Vercel** | Hosting (auto-deploys from GitHub) |
| **GitHub** | Code repository |

### Database design:
Simple key-value store using JSONB. One table (`app_data`) with keys like `registry`, `meals`, `weekly_shopping`, `monthly_shopping`, `tobuy_shopping`, `schedule`, `custody`. All data stored as JSON objects.

### Authentication:
Supabase Auth with email/password. Row-level security enabled — all authenticated users can read/write all data (household shared access).

### PWA:
Manifest.json configured for "Add to Home Screen" on iOS. Standalone display mode.

---

## 6. BUILD LOG

### Accounts created:
- GitHub: CMFoden
- Vercel: linked to GitHub
- Supabase: project "life-os"

### Files in the project:
```
life-os/
├── app/
│   ├── globals.css          — Global styles
│   ├── layout.js            — Root layout with fonts + PWA meta
│   └── page.js              — Main page with auth gate
├── components/
│   ├── Auth.js              — Login/signup screen
│   └── LifeOS.js            — Full app (dashboard, lists, registry, manual)
├── lib/
│   └── supabase.js          — Supabase client config
├── public/
│   └── manifest.json        — PWA manifest
├── .env.local               — Supabase URL + anon key (not in Git)
├── package.json
└── next.config.mjs
```

### Deployment:
- **GitHub repo:** github.com/CMFoden/life-os
- **Vercel URL:** [check Vercel dashboard]
- **Status:** ✅ Deployed and working

---

## 7. PHASE ROADMAP

### Phase 1 (DONE): Design + Deploy
- ✅ Registry mapped
- ✅ Design locked (v8)
- ✅ App built with Supabase persistence
- ✅ Deployed to Vercel
- ✅ Working on phone

### Phase 2 (NEXT): Full editability + real data
- Make everything editable from the app (add/edit/delete registry items, schedule, custody)
- Populate with real data
- Connect custody calendar to Google Sheet
- Replace Apple Notes shopping list

### Phase 3: Agent layer
- 🤖 Buttons that actually do things (draft WhatsApps, book appointments)
- Push notifications for upcoming items
- Google Calendar integration

### Phase 4: Polish
- Monthly "life report"
- Separate owner views (Chloë's view vs Cameron's)
- Packing lists per trip type
- Birthday/occasion reminders

---

## 8. KEY CONTEXT FOR FUTURE SESSIONS

- Chloë can't code (yet) — all instructions need to be step-by-step, copy-paste level
- Cameron is tech-oriented and will use it if it's nicely designed and removes pain
- The system needs to ingest things they already use (Excel, Google Sheets) not create a manual upheaval
- The insertion point in Chloë's day: after meditation and NYT games, alongside the Google Calendar 3-day view
- The emotional design matters as much as the functional design — this should feel like winning at life, not losing
- Custody: Tom (13) and Luke (11), week on/week off Newlands ↔ Kommetjie, their mom is Finnish and handles Finnish passport renewals
- Travel every 4-6 weeks, sometimes solo for work
- Multiple passports per person (SA, UK, NZ, Finnish across the family)
