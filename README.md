# Movie Lover

Frontend application for Movie Lover — a platform for analyzing your IMDB lists with AI-powered movie and TV show recommendations.

## Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Session management
  - Email verification via OTP codes
  - Password reset flow
  - Google OAuth 2.0 login

- **IMDB List Import**
  - CSV file upload and parsing
  - Background processing of imported data
  - Enrichment with detailed metadata from TMDB API

- **AI Chat**
  - Movie and TV show recommendations powered by Google Gemini 2.5 Flash
  - Personalized suggestions based on your imported IMDB lists
  - Chat history persistence

- **List Analytics**
  - Genre, year, country, and production company breakdowns
  - Rating statistics
  - Top directors and actors from your lists
  - Upcoming episodes tracker for TV shows in your lists

- **Media Browser**
  - Detailed movie and TV show pages
  - Links to IMDB pages

## Tech Stack

| Layer         | Technology               |
| ------------- | ------------------------ |
| Language      | TypeScript               |
| Framework     | React                    |
| Build Tool    | Vite                     |
| Routing       | React Router DOM         |
| Server State  | TanStack Query           |
| Forms         | React Hook Form + Zod    |
| UI Components | Radix UI                 |
| Styling       | Tailwind CSS             |
| Testing       | Vitest + Testing Library |

## Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
git clone https://github.com/your-username/movie-lover.git
cd movie-lover
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API
VITE_API_URL=http://localhost:3001

# TMDB
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/

# IMDB
VITE_IMDB_BASE_URL=https://www.imdb.com/

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tests

```bash
# Unit tests
npm run test
```

## Project Structure

```
src/
├── assets/            # Static assets
├── components/        # Shared UI components
├── const/             # Application constants
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API service layer
├── store/             # Global state (Zustand / Context)
├── types/             # TypeScript types and interfaces
└── utils/             # Utility functions
```
