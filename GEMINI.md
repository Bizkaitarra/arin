## Project Overview

This is a mobile application built with Ionic and React that provides information about public transport in Bizkaia, Spain. It uses Capacitor to access native functionalities and provides information about different transport services like Bizkaibus, Metro Bilbao, KBus, and Renfe.

The application is structured as a single-page application (SPA) using React and Ionic components. It uses `react-router-dom` for routing and `i18next` for internationalization. The data is fetched from different APIs for each transport service.

## Building and Running

To build and run the application, you can use the following commands:

*   **Install dependencies:** `npm install`
*   **Run in the browser:** `npm run dev`
*   **Build for production:** `npm run build`
*   **Run unit tests:** `npm run test.unit`
*   **Run e2e tests:** `npm run test.e2e`

## Development Conventions

*   The project uses TypeScript and React.
*   The code is formatted using ESLint.
*   The project uses `vitest` for unit testing and `cypress` for end-to-end testing.
*   The application is structured by features, with each transport service having its own directory containing the components, pages, and services related to it.
*   The application uses a context to manage the configuration of the application.

### IA Develpment interesting data

In samples folder you could find samples of different API response used in the app.
