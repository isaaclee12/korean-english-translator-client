# Korean-English Translator Client

This is the frontend React application for the Korean-English Translator, built with React, TypeScript, and Tailwind CSS.

## Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/korean-english-translator.git
cd korean-english-translator/korean-english-translator-client
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
- Create a `.env` file in the root directory
- Add the following environment variable:
```
VITE_API_URL=http://localhost:8000
```

4. **Run the Development Server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
src/
├── App.tsx           # Main application component
├── Translator.tsx    # Translation component
├── KoreanBreakdown.tsx # Korean phrase analysis component
└── components/       # Reusable components
```

## Features

- Real-time Korean-English translation
- Korean phrase analysis with cultural context
- Formality level detection
- Pronunciation guides
- Modern UI with Tailwind CSS
- TypeScript for type safety
- Hot module replacement for development

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the production version
- `npm run preview` - Preview the production build locally

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Axios for API calls
- React Router for navigation
