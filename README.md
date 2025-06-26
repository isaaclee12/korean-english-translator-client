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

## Environment Variables

- `VITE_API_URL` - URL of the backend server (default: http://localhost:8000)

## Development Notes

- The application uses Vite's environment variables (prefixed with VITE_)
- Hot module replacement is enabled for faster development
- TypeScript strict mode is enabled for better type safety
- Tailwind CSS is configured with dark mode supporting between Korean and English.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Run the development server:
   ```
   npm run dev
   ```

## Features
- Translate between Korean and English
- Simple, clean UI

## Note
This is a prototype. Translation uses a mock function; you can connect a real translation API later.
