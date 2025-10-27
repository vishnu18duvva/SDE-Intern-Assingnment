# User Directory Table

Simple React app that fetches users from https://reqres.in/api/users and displays them in a table with search, sort, filters and pagination.

Features
- Fetches all pages from reqres and displays users
- Search by name or email
- Sort by first name / last name / email
- Filter by email domain or first-letter of first name
- Client-side pagination
- Loading spinner and responsive layout

Quick start

Requirements: Node.js 18+ (or any Node 16+), npm or yarn

Install and run locally:

```powershell
cd user-directory
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Build for production:

```powershell
npm run build
npm run preview
```

Deployment
- You can deploy this folder to Vercel or Netlify. For Vercel just connect the repo and Vercel will detect the Vite React project.

Notes
- This is a small demo; the dataset from reqres is tiny so the app fetches all pages on load to allow searching across all users. For larger APIs consider server-side search or incremental loading.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
