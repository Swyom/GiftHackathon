# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend Market Data API

The backend server can proxy market data using an API key (Finnhub is used in the example).

1. Create a `.env` file in the project root with your key:

   ```text
   FINNHUB_KEY=your_finnhub_api_key_here
   ```

2. Start the backend (from `/backend` directory):

   ```bash
   cd backend
   node server.js
   ```

   The server listens on port 5000 by default.

3. To fetch the latest **Nifty 50** quote, call the new endpoint:

   ```http
   GET http://localhost:5000/api/nifty
   ```

   The response is the JSON returned by Finnhub (`c` current price, `h` high, etc.).

4. The React frontend already hits this route on the dashboard and displays the current price under "Quick Stats". You can adapt it however you like.

5. You can switch to a different provider by changing the URL in `server.js` and putting the appropriate key in `FINNHUB_KEY`.

