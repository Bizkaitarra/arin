# Arin - Ionic/React Transport App

## Key Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build web | `npm run build` |
| Build Android | `make build` (runs `ionic build && npx cap sync android`) |
| Unit tests | `make test` or `npx vitest run` |
| Unit tests (watch) | `npm run test.unit` |
| E2E tests | `npm run test.e2e` |
| Lint | `npm run lint` |

## TypeScript

- `tsconfig.json` has `strict: false` - type checking is intentionally loose
- Test files (`.spec.ts`, `.test.ts`) are excluded from compilation

## Vite Dev Server Proxies

Configured in `vite.config.ts`:
- `/api-euskotren` → `https://www.euskotren.eus`
- `/api-metrobilbao` → `https://api.metrobilbao.eus`

## Project Structure

- `src/pages/` - Route pages
- `src/components/` - Reusable UI components
- `src/services/` - API clients for each transport service (Bizkaibus, Metro Bilbao, KBus, Renfe, Euskotren)
- `src/context/` - React contexts (app config)
- `src/data/` - Static data and types
- `src/locales/` - i18n translations

## Testing

- Unit: Vitest with jsdom (`src/setupTests.ts` for setup)
- E2E: Cypress runs against `http://localhost:5173`

## Android Build Notes

- Uses Capacitor 7 with Android 7.0.1
- App ID: `bizkaitarra.arin`
- Build outputs go to `android/` folder after `cap sync`