# NightBFF: Find Your Crew

NightBFF is a mobile application (iOS Frontend) designed to help users find and connect with like-minded people to form groups for nightlife activities. This project is built using Expo and leverages modern React Native development practices.

## Project Overview & Architecture

This repository contains the iOS frontend for the NightBFF application.

**Core Technologies:**
*   **Framework**: Expo SDK 54
*   **UI Library**: React Native 0.81.x (via Expo SDK 54)
*   **Language**: TypeScript
*   **Core React**: React 19
*   **Navigation**: Expo Router v3
*   **State Management**: Zustand (primarily for `createGroupStore`)
*   **Data Fetching & Caching**: React Query (TanStack Query v5) for API interactions
*   **HTTP Client**: Axios for API requests with global interceptors
*   **Authentication**: JWT token handling with automatic expiry detection
*   **Styling**: Primarily StyleSheet, with constants for colors and spacing.

## Features

*   **Robust Session Timeout Handling (MVP)**: Comprehensive session management with global 401/403 API interception, automatic logout on token expiry, client-side token validation with clock skew tolerance, and user-friendly notifications.
*   **Group Creation & Management**: Multi-step group creation flow with various activity types and customization options.
*   **Chat Interface**: Real-time chat functionality with optimistic updates.
*   **User Authentication**: Login/logout flow with secure token storage.
*   **Profile Management**: User profile viewing and editing capabilities.
*   **Explore Groups**: Browse and discover groups based on interests and location.

## Get Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dompi123/nightbf.git
    cd nightbf
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Note: If you encounter peer dependency issues, try `npm install --legacy-peer-deps`. However, recent installations have succeeded without this flag.)*

3.  **Start the development server:**
    ```bash
    npx expo start
    ```
    Follow the terminal prompts to open the app in an iOS simulator or on a physical device using the Expo Go app (ensure it's compatible with SDK 54).

## Running Tests

The test suite includes unit and component tests for Zustand stores, React components, and React Query hooks.

All tests are currently **passing** after recent fixes for Expo SDK 54 / React 19 compatibility.

To run the automated test suite:
```bash
npm run test
```
To run TypeScript checks:
```bash
npx tsc --noEmit --pretty
```
*(Note: You might see TypeScript errors related to test file setup (`TS2352`, `TS2307`) when running `npx tsc`; these do not affect application runtime or the Jest test results.)*

## API Integration Points

**For Backend Developers:**

*   **API Management**: All API calls are managed via React Query hooks located in `src/hooks/api/`.
*   **Global API Service**: A centralized API service with interceptors is configured in `src/utils/apiService.ts`. This service handles:
    *   Automatic attachment of authentication tokens to requests
    *   Global error handling for 401/403 responses (session expiry)
    *   Consistent base URL configuration
    *   Request/response logging and transformation
*   **Backend Configuration**: Update the API baseURL in `src/utils/apiService.ts` to point to your backend endpoints.
*   **Data Structures**: `src/services/api/mockService.ts` contains examples of current data structures expected by the frontend.
*   **Authentication Integration**: The AuthContext (`src/contexts/AuthContext.tsx`) manages user authentication state and integrates with the global API service for automatic session handling.

## Code Structure Overview

*   `app/`: Contains all routes and screens managed by Expo Router. Includes subdirectories for navigation groups (e.g., `(tabs)`, `createGroup`).
*   `assets/`: Static assets like images and fonts.
*   `components/`: Shared UI components (e.g., `ThemedText`, `ChatListItem`).
*   `constants/`: Global constants (e.g., `Colors`, `Spacing`, `Interests`).
*   `contexts/`: React context providers (e.g., `AuthContext`).
*   `hooks/`: Custom React hooks, including API interaction hooks using React Query (in `hooks/api/`).
*   `services/`: API service definitions and mock services.
*   `stores/`: Zustand state management stores (e.g., `createGroupStore`).
*   `types/`: Global TypeScript type definitions.
*   `src/utils/`: Utility functions including API service configuration and event emitters.

## Known Issues & Deferred Tasks

This section outlines known bugs, limitations, and tasks deferred for future development or during backend integration.

**Recently Resolved:**
*   **Session Timeout Bug**: **MVP Fixed**. The app now includes a global 401/403 interceptor, automatic logout sequence with cache clearing, and resilient token handling on startup. Future enhancements like token refresh are deferred.

**Deferred Tasks & Technical Debt:**
*   **TypeScript Errors in Test Files**: **RESOLVED**. All TypeScript errors in app and test files have been fixed. `npx tsc --noEmit --pretty` now passes with 0 errors.
*   **Accessibility (A11y) Pass (Task 7.4):** A comprehensive accessibility review and implementation pass across the application has been deferred.
*   **Performance Profiling (Task 7.5):** Performance profiling using React DevTools Profiler with Expo Go is currently blocked. Despite Hermes being enabled, the profiler fails to connect. This needs to be resolved to conduct thorough performance analysis and optimizations.
*   **Minor Visual Glitches:**
    *   **Chat Optimistic Updates:** Behavior of optimistic updates in the chat interface (e.g., message send status) needs further observation and refinement for a seamless user experience.
    *   **Create Group - Step 1 Header:** A minor visual glitch was previously noted in the header of the first step of group creation; verify if still present.
    *   **Explore Groups Back Button:** The back button in the "Explore Groups" section might display incorrect text; verify if still present.
*   **Deferred Logic/Features (Mocked or Partially Implemented):**
    *   **Full Backend Integration**: While session management infrastructure is in place, full backend API integration is pending backend development completion.
    *   **Native Pickers:** Date and time selection in the "Create Group" flow currently uses basic inputs. Implementation of native iOS date/time pickers is deferred.
    *   **Destination Search (Create Group - Step 5):** The destination search/selection functionality is a basic prototype. Full search capabilities (e.g., API-backed geocoding, map integration for selection) are not implemented.
    *   **User Profile:** User profile data is largely mocked/static.
    *   **Chat Functionality:** Advanced chat features (read receipts, typing indicators, multimedia messages, etc.) are not implemented. Push notifications for chat are not implemented.
    *   **"Pro" Features:** Any features marked as "Pro" (e.g., adding a link in group creation) are currently UI placeholders without actual subscription checks or backend logic.

## Backend Integration Handoff

**Current Status**: The frontend is ready for backend integration with the Session Timeout MVP implementation providing a solid foundation for API connectivity and session management.

**Handoff Tag**: `v0.1.0-backend_integration_handoff`

**Integration Points**:
*   Global API service configured and ready for backend endpoint integration
*   Session management infrastructure in place with automatic token handling
*   Comprehensive error handling for authentication failures
*   Mock data structures available as reference for API contracts

## Learn More (Expo Resources)

*   [Expo documentation](https://docs.expo.dev/)
*   [Expo Router documentation](https://docs.expo.dev/router/introduction/)
*   [Expo Discord community](https://chat.expo.dev)
