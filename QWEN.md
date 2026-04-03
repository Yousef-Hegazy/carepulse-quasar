# Care Pulse - Project Context

## Project Overview

**Care Pulse** is a healthcare management system built with **Quasar Framework v2** (Vue 3 + Vite). It provides appointment scheduling functionality for both patients and doctors, with support for multi-language (English and Arabic) and dark mode UI.

### Key Technologies

| Category | Technology |
|----------|------------|
| **Framework** | Quasar Framework v2.19.2 |
| **Frontend** | Vue 3.5.31 + TypeScript |
| **State Management** | Pinia 3.0.1 |
| **Data Fetching** | TanStack Vue Query 5.96.0 |
| **Authentication** | Keycloak (OIDC provider) |
| **Routing** | Vue Router 5.0.4 |
| **i18n** | Vue I18n 11.0.0 |
| **HTTP Client** | Axios 1.14.0 |
| **API Client** | @hey-api/openapi-ts (auto-generated) |
| **Desktop** | Electron 41.1.1 |
| **Package Manager** | Bun |

### Architecture

- **SPA Mode**: Single Page Application with history-based routing
- **RTL Support**: Built-in right-to-left support for Arabic language
- **Authentication**: Keycloak OAuth2 with PKCE flow
- **API Layer**: Auto-generated TypeScript client from OpenAPI spec
- **Desktop Support**: Electron wrapper for cross-platform desktop app

## Project Structure

```
carepulse/
├── src/                      # Main application source
│   ├── api/generated/        # Auto-generated API client
│   ├── boot/                 # Boot files (i18n, keycloak, vue-query, etc.)
│   ├── components/           # Reusable Vue components
│   │   └── forms/            # Form components
│   ├── css/                  # Global styles (SCSS)
│   ├── i18n/                 # Internationalization files
│   │   ├── en-US/            # English translations
│   │   └── ar/               # Arabic translations
│   ├── layouts/              # Layout components
│   ├── lib/                  # Utility libraries
│   ├── pages/                # Page components
│   ├── router/               # Vue Router configuration
│   ├── stores/               # Pinia stores (auth, user)
│   └── App.vue               # Root component
├── src-electron/             # Electron main process code
├── public/                   # Static assets
├── quasar.config.ts          # Quasar configuration
├── openapi-ts.config.ts      # OpenAPI client generator config
└── package.json              # Dependencies and scripts
```

## Building and Running

### Install Dependencies

```bash
bun install
```

### Development Mode

```bash
bun dev
# or
quasar dev
```

The dev server runs with hot-code reloading and error reporting.

### Build for Production

```bash
bun run build
# or
quasar build
```

### Linting and Formatting

```bash
# Lint files
bun run lint

# Format files
bun run format
```

### API Client Generation

The API client is auto-generated from the OpenAPI spec:

```bash
bun run api:generate
```

This reads from `http://localhost:5119/openapi/v1.json` and generates clients in `src/api/generated/`.

### Electron Build

The project includes Electron support. To build the desktop app:

```bash
quasar build -m electron
```

## Development Conventions

### Code Style

- **TypeScript**: Strict mode enabled with Vue shim support
- **Single Quotes**: Used for strings (Prettier config)
- **Print Width**: 100 characters
- **Type Imports**: Preferred as `import type` (enforced by ESLint)

### ESLint Configuration

- Uses flat config format
- Rules based on:
  - `@eslint/js` recommended
  - `eslint-plugin-vue` (essential)
  - `@vue/eslint-config-typescript` (recommended)
  - `@quasar/app-vite/eslint` (recommended)
- Custom rules relax certain TypeScript strictness for development flexibility

### Component Structure

Components follow Vue 3 `<script setup>` syntax with TypeScript:

```vue
<script setup lang="ts">
// Component logic
</script>

<template>
  <!-- Template -->
</template>
```

### State Management

Pinia stores are used for state management with HMR support:

```typescript
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... }
});
```

### Key Boot Files

| File | Purpose |
|------|---------|
| `boot/i18n.ts` | Vue I18n setup with locale detection |
| `boot/keycloak.ts` | Keycloak initialization and auth guards |
| `boot/vue-query.ts` | TanStack Query setup |
| `boot/api.ts` | API client initialization |
| `boot/quasar-lang-pack.ts` | Quasar language pack loading |

### Authentication Flow

1. Keycloak initialized with `check-sso` on app load
2. Route guards check `meta.public` for public routes
3. Token refresh handled via `onTokenExpired` callback
4. PKCE method: S256 for secure OAuth flow

### Styling

- Global SCSS with Quasar variables
- Custom font: "Plus Jakarta Sans"
- Dark mode by default
- RTL support enabled
- Utility classes for common layouts (`.container`, `.sub-container`, `.sidebar`)

## Key Configuration Files

| File | Purpose |
|------|---------|
| `quasar.config.ts` | Main Quasar app configuration |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.js` | ESLint rules |
| `.prettierrc.json` | Prettier formatting rules |
| `openapi-ts.config.ts` | API client generation settings |
| `postcss.config.js` | PostCSS plugins (RTL support) |

## Environment

- **Node.js**: v20, v22, v24, v26, or v28
- **Keycloak Server**: `https://keycloak.appwrite-yousef.top/`
- **Keycloak Realm**: `CarePulse`
- **Client ID**: `carepulse`

## Pages

| Page | Route | Description |
|------|-------|-------------|
| `IndexPage.vue` | `/` | Landing page with auth form |
| `PatientRegister.vue` | `/patient-register` | Patient registration |
| `OAuthSuccess.vue` | `/oauth-success` | OAuth callback handler |
| `ErrorNotFound.vue` | `/*` | 404 error page |
