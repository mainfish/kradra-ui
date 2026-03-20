# Kradra UI — Feature-based auth structure

This project keeps the login UI, reducer state, reducer actions, API layer, and auth business logic split by feature.

## Stack

- React
- Vite
- Tailwind CSS
- Feature-based auth module structure

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is generated into `dist/`.

## Auth flow structure

```text
src/
  features/
    auth/
      components/
        LoginForm.jsx
      model/
        loginFormReducer.js
        loginFormActions.js
      api/
        loginApi.js
        authActions.js
      index.js

  lib/
    api.js
    config.js
    storage.js
```

## Current behavior

- UI sends a real `fetch` request to `https://api.kradra.com/auth/login`
- If the API is unavailable, the UI shows a network/API error
- On success, session data is stored in localStorage
