# ⚔️ AI Battlefield

**Where critical thinking goes to train.**

AI Battlefield is a web platform that helps people think better — through structured debate, intelligence analysis, and prediction markets. Think of it as a gym for your brain, but with real opponents, AI sparring partners, and a community that actually cares about being right over being loud.

> Built with Next.js, Supabase, and a lot of late nights.

---

## What Can You Do Here?

### 🏋️ The Gym — Sharpen Your Arguments
The gym is the heart of AI Battlefield. It's where you go to practice debate, identify logical fallacies, and get uncomfortable with your own reasoning.

- **Live Debate Rooms** — Jump into real-time debates with other users. Pick a topic, pick a side, and make your case.
- **AI Sparring** — Train 1-on-1 against AI personas with different debate styles and difficulty levels. Great for practice when you can't find a human opponent.
- **Fallacy & Rebuttal Drills** — Interactive exercises that teach you to spot weak arguments (including your own).
- **The Dojo** — A calmer, reflective space for longer-form reasoning practice.

### 🕵️ Intel Ops — Collaborative Intelligence
Think of this as a shared notebook for research and analysis, built for teams and communities.

- **Submit & Review Intel** — Drop your findings, tag them by category, and let the community weigh in.
- **Dossier Annotations** — Highlight and comment on key intel collaboratively.
- **Confidence Scoring** — Every submission carries a credibility meter so readers know what's verified and what's speculation.
- **Global Heatmap** — Visualize where intel is coming from around the world.

### 📊 Prediction Markets — Put Your Money Where Your Mouth Is
Make predictions on real-world events and track how accurate you actually are over time.

- **Binary Markets** — Will X happen or not? Place your prediction and watch the odds shift.
- **Volume Tracking** — See how many people are betting on each side in real time.
- **Brier Score** — Your prediction accuracy follows you. No hiding from bad calls.

### 👥 Communities — Find Your People
Public and private communities for every interest area — from geopolitics to tech ethics.

- **Real-Time Chat** — Fast, encrypted messaging within each community.
- **Events & Meetups** — Organize debates, watch parties, or study sessions.
- **Discussion Threads** — Longer conversations that don't disappear in a chat scroll.
- **Media Sharing** — Upload images and resources to share with your group.

### 🧠 Profile & Progression
Your profile isn't just a page — it's a record of how you think.

- **XP & Leveling** — Earn experience from debates, drills, predictions, and community participation.
- **Belief Tracker** — Log your beliefs and watch how they evolve over time as you encounter new evidence.
- **Blind Spot Analysis** — Understand where your reasoning tends to break down.
- **Streak Tracking** — Stay consistent and build a daily practice habit.

### 🌀 The Void — Anonymous Conversations
Sometimes you need to speak freely without your name attached. The Void provides temporary, ephemeral chat sessions that auto-expire.

### 🎓 Academy
Structured learning paths for improving critical thinking, argumentation, and analytical reasoning.

### 🏰 War Room
A dedicated space for high-stakes team strategy sessions and collaborative decision-making.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime + Auth) |
| **Styling** | TailwindCSS with custom glassmorphism and dark-mode-first design |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | Framer Motion + custom CSS animations |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm**, **pnpm**, or **bun**
- A [Supabase](https://supabase.com/) project (free tier works fine)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/vishalcoc44/AI-Battlefield-Web.git
cd AI-Battlefield-Web

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file in the root directory:
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in.

---

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Login, signup, password recovery
│   ├── dashboard/    # Main dashboard
│   ├── gym/          # Debate rooms, drills, sparring
│   ├── intel/        # Intel ops & dossiers
│   ├── prediction/   # Prediction markets
│   ├── communities/  # Community pages
│   ├── profile/      # User profile, beliefs, blind spots
│   ├── void/         # Ephemeral anonymous chat
│   ├── academy/      # Learning paths
│   ├── war-room/     # Strategy sessions
│   └── dojo/         # Reflective practice
├── components/       # Reusable UI components
├── lib/              # Data services, types, utilities
└── supabase/         # Migrations & schema definitions
```

---

## Contributing

This project is actively being built. If you want to contribute, open an issue first so we can discuss what you have in mind. PRs without context will probably get ignored — nothing personal, just trying to keep things coherent.

---


*Built by [Vishal](https://github.com/vishalcoc44) — because the world needs better arguments, not louder ones.*
