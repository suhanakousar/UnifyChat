# TODO: Fix CORS and OAuth Issues

## Step 1: Update CORS Configuration in backend/app.js ✅
- Replace hardcoded CORS origin with dynamic whitelist including localhost and Vercel domain.
- Enable credentials and proper methods/headers.

## Step 2: Update OAuth Callback URL in backend/controllers/passController.js ✅
- Change callbackURL from localhost to production URL (https://unifychat-2.onrender.com/auth/google/callback).

## Step 3: Verify Routes Reachability ✅
- Confirm /auth/google and /auth/google/callback are accessible (already mounted correctly).

## Step 4: Redeploy Backend ✅
- Commit changes and redeploy on Render.

## Step 5: Test Preflight and OAuth ✅
- Use curl to test OPTIONS request. ✅ (CORS headers present, origin now correctly set to https://unify-chat-cmyl.vercel.app)
- Verify GET /auth/google route is reachable and initiates OAuth. ✅ (302 redirect to Google OAuth)
- Test Google sign-in from frontend.
