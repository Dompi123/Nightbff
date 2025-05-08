# NightBFF: Find Your Crew

NightBFF is a mobile application (iOS Frontend) designed to help users find and connect with like-minded people to form groups for nightlife activities. This project is built using Expo and leverages modern React Native development practices.

## Project Overview & Architecture

This repository contains the iOS frontend for the NightBFF application.

**Core Technologies:**
*   **Framework**: Expo SDK 53
*   **UI Library**: React Native 0.79.x (via Expo SDK 53)
*   **Language**: TypeScript
*   **Core React**: React 19
*   **Navigation**: Expo Router v3
*   **State Management**: Zustand (primarily for `createGroupStore`)
*   **Data Fetching & Caching**: React Query (TanStack Query v5) for API interactions
*   **Styling**: Primarily StyleSheet, with constants for colors and spacing.

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
    Follow the terminal prompts to open the app in an iOS simulator or on a physical device using the Expo Go app (ensure it's compatible with SDK 53).

## Running Tests

The test suite includes unit and component tests for Zustand stores, React components, and React Query hooks.

All tests are currently **passing** after recent fixes for Expo SDK 53 / React 19 compatibility.

To run the automated test suite:
```bash
npm run test
```
To run TypeScript checks:
```bash
npx tsc --noEmit --pretty
```
*(Note: You might see TypeScript errors related to test file setup (`TS2352`, `TS2307`) when running `npx tsc`; these do not affect application runtime or the Jest test results.)*


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

## Known Issues & Deferred Tasks

This section outlines known bugs, limitations, and tasks deferred for future development or during backend integration.

**High Priority:**
*   **Session Timeout Bug:** Users are unexpectedly logged out. The exact cause and reliable reproduction steps are yet to be determined. This is a high-priority issue requiring investigation and resolution, likely before or during backend integration.

**Deferred Tasks & Technical Debt:**
*   **Accessibility (A11y) Pass (Task 7.4):** A comprehensive accessibility review and implementation pass across the application has been deferred.
*   **Performance Profiling (Task 7.5):** Performance profiling using React DevTools Profiler with Expo Go is currently blocked. Despite Hermes being enabled, the profiler fails to connect. This needs to be resolved to conduct thorough performance analysis and optimizations.
*   **Minor Visual Glitches:**
    *   **Chat Optimistic Updates:** Behavior of optimistic updates in the chat interface (e.g., message send status) needs further observation and refinement for a seamless user experience.
    *   **Create Group - Step 1 Header:** A minor visual glitch was previously noted in the header of the first step of group creation; verify if still present.
    *   **Explore Groups Back Button:** The back button in the "Explore Groups" section might display incorrect text; verify if still present.
*   **Deferred Logic/Features (Mocked or Partially Implemented):**
    *   **Authentication:** Full authentication flow with a backend is not implemented; current screens are placeholders.
    *   **Native Pickers:** Date and time selection in the "Create Group" flow currently uses basic inputs. Implementation of native iOS date/time pickers is deferred.
    *   **Destination Search (Create Group - Step 5):** The destination search/selection functionality is a basic prototype. Full search capabilities (e.g., API-backed geocoding, map integration for selection) are not implemented.
    *   **User Profile:** User profile data is largely mocked/static.
    *   **Chat Functionality:** Advanced chat features (read receipts, typing indicators, multimedia messages, etc.) are not implemented. Push notifications for chat are not implemented.
    *   **"Pro" Features:** Any features marked as "Pro" (e.g., adding a link in group creation) are currently UI placeholders without actual subscription checks or backend logic.

## Learn More (Expo Resources)

*   [Expo documentation](https://docs.expo.dev/)
*   [Expo Router documentation](https://docs.expo.dev/router/introduction/)
*   [Expo Discord community](https://chat.expo.dev)
