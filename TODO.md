# TODO: Debug and Fix Google OAuth 500 Error

## Step 1: Add Debug Logging to GoogleStrategy in passController.js ✅
- Add env checks and logging at top.
- Wrap GoogleStrategy callback with try/catch and detailed logging.
- Log profile data, DB queries, and errors.

## Step 2: Wrap /auth/google/callback Route with Error Handling in userRoutes.js ✅
- Add logging for req.query.
- Wrap passport.authenticate with error handling and redirects.

## Step 3: Update Session Config in app.js for Production ✅
- Ensure session middleware has secure cookie options for production.

## Step 4: Verify DB Table Name and Structure ✅
- Run SQL queries to confirm table name ("Users" vs "User") and columns.
- Update code if mismatch found.

## Step 5: Test Locally with Provided Envs ✅
- Run backend locally with envs to reproduce the error.
- Check console logs for stack traces.

## Step 6: Redeploy and Test on Render ✅
- Commit changes and redeploy.
- Reproduce sign-in and check Render logs for errors.

## Step 7: Fix Identified Issues ✅
- Based on logs, apply fixes (e.g., envs, table names, session config).
