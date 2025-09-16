# NightBFF iOS Frontend - Handoff Summary for Backend Integration

**Initial Handoff Version (Tag):** `v0.1.0-backend_integration_handoff`
**Current `master` Branch Status:** This document reflects the latest `master` branch, which includes the Expo SDK 54 upgrade and all TypeScript error fixes. A new, final handoff tag will be created upon completion of all Phase 7 refinements.
**Date:** June 14, 2025

## 1. Introduction

Welcome to the NightBFF iOS frontend codebase! This document provides key information to help you begin backend integration. The primary goal of the current frontend version is to offer a stable platform with core features and UI implemented, using mock data, ready for connection to your live services.

## 2. Accessing the Codebase

*   **GitHub Repository:** `https://github.com/Dompi123/nightbf.git`
*   **Recommended Starting Point (Tag):** Please ensure you clone the repository and then check out the specific tag created for this handoff:
    ```bash
    git checkout v0.1.0-backend_integration_handoff
    ```
    We advise creating your feature branches for integration work off this tag.
*   **Setup & Running:** For detailed setup, installation, and running instructions, please refer to the main `README.md` file in the root of the repository.

## 3. Key Integration Points

### 3.1. API Service Configuration
*   All API calls from the frontend are intended to be routed through a global Axios instance configured in: `src/utils/apiService.ts`.
*   **ACTION REQUIRED:** You will need to **update the `baseURL` placeholder** in this file to point to your actual backend API deployment.
    ```typescript
    // src/utils/apiService.ts - Excerpt
    const api = axios.create({
      baseURL: 'YOUR_API_BASE_URL', // <<< REPLACE THIS
      // ... other configurations
    });
    ```

### 3.2. Authentication Flow
*   **Login/Signup:** Review functions like `loginUser`, `signupUser` in `src/services/api/mockService.ts` for the current frontend request payload structure (typically email/password) and expected response structure (which should include an authentication token, e.g., `{ user: User, token: string }`).
*   **Token Handling:** The frontend expects a JWT as the authentication token. This token is stored securely using `expo-secure-store` under the key `userAuthToken`.
*   **Token Attachment:** The `apiService` in `src/utils/apiService.ts` includes a request interceptor that automatically retrieves the token from secure storage and attaches it as a `Bearer` token in the `Authorization` header for authenticated API calls.

### 3.3. Session Timeout Handling (MVP Implemented)
*   The frontend now includes an MVP solution for session timeouts:
    *   The global `apiService` has a response interceptor that detects `401 Unauthorized` or `403 Forbidden` HTTP status codes.
    *   Upon detection, it emits an `'authError'` event using the utility in `src/utils/eventEmitter.ts`.
    *   `src/contexts/AuthContext.tsx` subscribes to this `'authError'` event and triggers a full logout sequence:
        *   Clears the token from `expo-secure-store`.
        *   Resets authentication state (`isAuthenticated`, `user`, `userToken`).
        *   Clears the React Query cache (`queryClient.clear()`).
        *   Redirects the user to the login screen with an alert message ("Session expired. Please log in again.").
    *   Additionally, `AuthContext.bootstrapAsync` performs a basic client-side check of the JWT's `exp` claim on app load (with 5-minute clock skew tolerance) and will trigger logout if the stored token is found to be expired.

### 3.4. Expected Data Structures & Mock Service
*   The file `src/services/api/mockService.ts` currently provides all data for the application and serves as a reference for the data structures the frontend components expect for various features (e.g., chat lists, conversation messages, group details, user profiles).
*   As you integrate real endpoints, these mock functions will be replaced or updated to call your APIs via the global `apiService`.

## 4. Environment Variables
*   Currently, the primary configuration needed is the `baseURL` in `src/utils/apiService.ts`.
*   If other environment-specific variables are required for your backend (e.g., API keys for third-party services the frontend might need to initialize), please provide details, and we can establish a `.env` file setup (e.g., with a `.env.example` template).

## 5. Current Feature Status
*   **Core Features Implemented (UI & Mock Logic):** Authentication (Login/Signup/Logout), Home Screen (Chat List), Conversation View, Profile View & Basic Edit, Create Group (7-step flow), Explore Groups (basic list).
*   **Session Timeout Handling:** MVP implemented as described above.

## 6. Known Issues & Deferred Items
*   **Session Timeout - Future Enhancements:** The MVP is fully implemented with global 401/403 interceptors, automatic logout sequence with cache clearing, and resilient token handling. Features like token refresh, "remember me," proactive expiry warnings, and more nuanced user feedback for different auth errors are deferred.
*   **TypeScript Errors in Test Files:** **RESOLVED**. All previously known TypeScript errors in test files have been fixed. The codebase is now type-clean.
*   **A11y (Accessibility):** A full accessibility pass has been deferred. Basic accessibility has been considered (e.g., some labels), but comprehensive testing and implementation of all A11y best practices are pending.
*   **Minor Visual Glitches:** Examples include potential inconsistencies in chat optimistic updates under specific conditions and minor header alignment variations on some screens. These are considered non-critical for initial integration.
*   **Performance Profiling:** Full performance profiling via React DevTools has been challenging due to Expo Go connection issues. The app generally performs well in development, but deep profiling is deferred.
*   **Deferred Logic (Create Group):** Native pickers for date/time and advanced destination search functionality (e.g., Google Places API integration) in the Create Group flow are currently using basic inputs or mock logic.

## 7. Running Tests
*   The automated test suite can be run using:
    ```bash
    npm run test
    ```
    (or `yarn test` if `yarn.lock` is present)
*   All tests related to core functionality are currently passing on the handoff tag (`v0.1.0-backend_integration_handoff`).

## 8. Technical Architecture Overview

### 8.1. Core Technologies
*   **Framework:** Expo SDK 54 with React Native 0.81.x
*   **Language:** TypeScript
*   **React Version:** React 19
*   **Navigation:** Expo Router v3
*   **State Management:** Zustand for local state, React Query for server state
*   **HTTP Client:** Axios with global interceptors
*   **Authentication:** JWT tokens with expo-secure-store
*   **Testing:** Jest with React Native Testing Library

### 8.2. Project Structure
```
/app                    # Expo Router pages and layouts
/assets                 # Static assets (images, icons, etc.)
/components             # Reusable UI components
/constants              # Global constants (colors, spacing, etc.)
/contexts               # React Context providers
/hooks                  # Custom React hooks (including API hooks)
/services               # API service definitions and mock implementations
/src
  /contexts             # Additional context providers
  /hooks                # Custom hooks organized by functionality
  /services             # Service implementations
  /types                # TypeScript type definitions
  /utils                # Utility functions and configurations
/stores                 # Zustand state stores
```

### 8.3. Data Flow
1. **UI Components** trigger actions via custom hooks
2. **React Query Hooks** (`src/hooks/api/`) manage API calls and caching
3. **API Service** (`src/utils/apiService.ts`) handles HTTP requests with authentication
4. **Mock Service** (`src/services/api/mockService.ts`) currently provides data structures
5. **AuthContext** manages authentication state and session handling

## 9. Integration Checklist

### Phase 1: Initial Setup
- [ ] Clone repository and checkout `v0.1.0-backend_integration_handoff` tag
- [ ] Update `baseURL` in `src/utils/apiService.ts`
- [ ] Review mock data structures in `src/services/api/mockService.ts`
- [ ] Set up development environment following README.md

### Phase 2: Authentication Integration
- [ ] Implement login/signup endpoints matching expected request/response format
- [ ] Test JWT token generation and validation
- [ ] Verify session timeout handling works with real backend responses
- [ ] Test automatic token attachment to authenticated requests

### Phase 3: Core Features Integration
- [ ] Replace mock chat/messaging endpoints with real implementations
- [ ] Integrate group creation and management APIs
- [ ] Connect user profile endpoints
- [ ] Implement group discovery/exploration APIs

### Phase 4: Testing & Validation
- [ ] Run frontend test suite to ensure no regressions
- [ ] Test end-to-end user flows with real backend
- [ ] Validate error handling and edge cases
- [ ] Performance testing with real data loads

## 10. Contact & Communication

For any questions regarding the frontend codebase or integration, please reach out to:

*   **Technical Lead:** Dompi123 (GitHub: @Dompi123)
*   **Repository:** https://github.com/Dompi123/nightbf
*   **Issues/Questions:** Please create GitHub issues for specific technical questions
*   **Integration Status:** We recommend creating a shared integration branch for collaborative work

## 11. Next Steps

1. **Review this handoff document** and the updated README.md
2. **Set up the development environment** using the provided instructions
3. **Examine the mock service** to understand expected data contracts
4. **Begin with authentication integration** as it's foundational for all other features
5. **Maintain the handoff tag** as a stable reference point during integration

We look forward to a successful integration and are available to support the backend development process!

---

**Document Version:** 1.0  
**Last Updated:** June 14, 2025  
**Frontend Version:** v0.1.0-backend_integration_handoff 