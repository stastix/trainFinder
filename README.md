# Hamburg → Amsterdam Train Search (Next.js)

This is a **Next.js** project that allows users to search train connections between Hamburg and Amsterdam.

The project was intended to fetch real-time journeys using the **Deutsche Bahn Trip API**, including direct and connecting trains. Due to limitations with the DB API subscription (free plan was pending), live API access could not be used, so the project currently uses **mock data** to simulate train connections.

---

## Features

- Search outbound and return trips between Hamburg and Amsterdam.
- Supports **round trips** and multiple overnight options.
- Server-side caching for search results.
- Mock data fallback for testing without live DB API access.
- Simple and clean UI powered by Next.js, Tailwind and Shadn.

---

## Getting Started

### Prerequisites

- Node.js (v18+) installed

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```
