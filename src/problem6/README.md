# Live Scoreboard API Service Specification

## Overview
This module provides backend API services for a website scoreboard that displays the top 10 users' scores and supports live updates. It ensures secure score updates and real-time broadcasting to all connected clients.

---

## Functional Requirements

1. **Scoreboard Display**: The website displays a scoreboard showing the top 10 users by score.
2. **Live Updates**: The scoreboard updates in real-time as users' scores change.
3. **Score Update Action**: When a user completes a specific action, their score increases. The frontend dispatches an API call to update the score.
4. **Security**: Only authorized users can update their own scores. Prevent unauthorized or malicious score increases.

---

## API Endpoints

### 1. Get Top Scores
- **Endpoint:** `GET /api/scoreboard/top`
- **Description:** Returns the top 10 users and their scores.
- **Response:**
  ```json
  [
    { "userId": "string", "username": "string", "score": number },
    ... (up to 10 entries)
  ]
  ```

### 2. Update User Score
- **Endpoint:** `POST /api/scoreboard/update`
- **Description:** Increases the authenticated user's score by 1 (or a specified amount, if needed).
- **Request Body:**
  ```json
  { "actionId": "string" } // Optional: to track the action performed
  ```
- **Authentication:** Required (e.g., JWT, session cookie)
- **Response:**
  ```json
  { "success": true, "newScore": number }
  ```

### 3. Live Scoreboard Updates (WebSocket)
- **Endpoint:** `ws://<host>/ws/scoreboard`
- **Description:** Clients subscribe to real-time scoreboard updates. Server broadcasts changes when scores are updated.
- **Message Format:**
  ```json
  { "type": "scoreboard_update", "topScores": [ ... ] }
  ```

---

## Security Considerations
- **Authentication:** All score update requests must be authenticated. Use secure tokens (JWT, OAuth, etc.).
- **Authorization:** Ensure users can only update their own scores.
- **Rate Limiting:** Prevent abuse by limiting the number of score updates per user per time window.
- **Input Validation:** Validate all incoming data.
- **Audit Logging:** Log all score update attempts for monitoring and investigation.

---

## Flow of Execution

```
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB
    participant AllClients

    User->>Frontend: Complete action
    Frontend->>Backend: POST /api/scoreboard/update (with auth)
    Backend->>DB: Validate & update user score
    DB-->>Backend: Updated score
    Backend-->>Frontend: Success response
    Backend-->>AllClients: Broadcast new top 10 via WebSocket
    AllClients-->>Frontend: Receive live update
```

---

## Comments & Suggestions for Improvement

> **[Comment]** Consider using Redis or similar in-memory store for fast leaderboard queries and pub/sub for real-time updates.
>
> **[Comment]** Implement exponential backoff or CAPTCHA if abuse is detected.
>
> **[Comment]** Add metrics and monitoring for score update rates and WebSocket connection health.
>
> **[Comment]** Optionally, allow for more granular score increments (e.g., different actions give different points).
>
> **[Comment]** Ensure GDPR/data privacy compliance for user data in the scoreboard.

---

## Deliverables
- REST API for score retrieval and update
- WebSocket endpoint for live updates
- Security and rate limiting mechanisms
- Documentation and flow diagram (this file)
