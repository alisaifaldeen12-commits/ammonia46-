# Security Specification & Threat Model for Firebase Integration

## 1. Data Invariants
- `users/{userId}` documents can only be created or written by the authenticated user matching `request.auth.uid`.
- Users cannot overwrite or modify other users' profile documents.
- `stats/userCount` is readable by any authenticated or guest user so total user count can be displayed, but can only be updated/incremented by signed-in users during profile creation.

## 2. Dirty Dozen Test Payloads
1. Unauthenticated write to `/users/some_uid` -> EXPECT PERMISSION_DENIED
2. Authenticated user A writing to `/users/userB_uid` -> EXPECT PERMISSION_DENIED
3. Authenticated user A creating `/users/userA_uid` with excessive payload (>256 chars name) -> EXPECT PERMISSION_DENIED
4. Unauthenticated update to `/stats/userCount` -> EXPECT PERMISSION_DENIED
5. User trying to write non-numeric `totalUsers` into `/stats/userCount` -> EXPECT PERMISSION_DENIED
6. User trying to write negative `totalUsers` into `/stats/userCount` -> EXPECT PERMISSION_DENIED
7. User trying to inject invalid fields into `/users/{userId}` -> EXPECT PERMISSION_DENIED
8. Spoofed email without authentication -> EXPECT PERMISSION_DENIED
9. Malformed document ID with special characters -> EXPECT PERMISSION_DENIED
10. Unauthenticated deletion of `/users/{userId}` -> EXPECT PERMISSION_DENIED
11. Authenticated deletion of another user's document -> EXPECT PERMISSION_DENIED
12. Attempt to write arbitrary data outside defined match paths -> EXPECT PERMISSION_DENIED
