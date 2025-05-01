# NightBFF: Find Your Crew

NightBFF is a mobile application designed to help users find and connect with like-minded people to form groups for nightlife activities. This project is built using Expo and leverages modern React Native development practices.

## Tech Stack

*   **Framework**: Expo SDK 53
*   **UI Library**: React Native 0.79.x (via Expo SDK 53)
*   **Language**: TypeScript
*   **Navigation**: Expo Router v3
*   **State Management**: Zustand
*   **Data Fetching**: React Query (TanStack Query)
*   **Core React**: React 19

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
    *(Note: If you encounter peer dependency issues, try running `npm install --legacy-peer-deps`. However, recent installations have succeeded without this flag.)*

3.  **Start the development server:**
    ```bash
    npx expo start
    ```
    Follow the terminal prompts to open the app in an emulator/simulator or on a physical device using the Expo Go app (ensure it's compatible with SDK 53).

## Running Tests

To run the automated test suite:

```bash
npm run test
```

**Known Test Issues:**
*   Currently, several tests fail due to incompatibilities with the testing setup (Jest/React Testing Library) and React 19/Expo SDK 53, particularly around mocking Zustand stores (`TypeError`) and React hooks (`ReferenceError`).
*   You might see TypeScript errors in test files (`TS2352`, `TS2307`) when running `npx tsc`; these are related to the test environment setup and do not affect the application runtime.
*   The core application logic tested in passing tests is considered functional. Fixing the failing tests is tracked as technical debt.

## Key Features Implemented (Mocks/Prototypes)

*   **Authentication Flow:** Basic mock screens for login/signup.
*   **Home Screen:** Placeholder home screen.
*   **Chat:** Mock chat list and conversation view.
*   **Create Group Flow:** Multi-step process to create a new group (mocked functionality).
*   **Profile:** Basic user profile screen.

## Known Issues & Technical Debt

The following items are known and deferred for future sprints:

*   **Accessibility (A11y):** A full accessibility pass is needed across the application.
*   **Performance:** Performance review and optimization have not yet been conducted.
*   **Create Group - Step 5 Picker:** The location picker logic needs refinement.
*   **Chat Glitch:** Minor visual glitch observed in the chat interface.
*   **Create Group - Step 1 Header:** Minor visual glitch in the header of the first step.
*   **Explore Groups Back Button:** Incorrect text displayed on the back button in the Explore Groups section.
*   **Test Failures:** As noted above, several unit/integration tests are failing post-SDK upgrade.

## Learn More (Expo Resources)

*   [Expo documentation](https://docs.expo.dev/)
*   [Expo Router documentation](https://docs.expo.dev/router/introduction/)
*   [Expo Discord community](https://chat.expo.dev)
