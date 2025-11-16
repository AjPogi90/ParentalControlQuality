# Firebase API Key Authentication Fix

## Problem
When trying to login, you get: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

This happens because your API Key has restrictions that prevent:
- Authentication requests
- Login operations
- Firebase Auth SDK calls

## Root Cause
Your API Key is restricted to specific APIs or specific domains/referrers that don't match `localhost:3000`

## Solution - Step by Step

### STEP 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Make sure you're logged into the correct Google account
3. Project dropdown should show: **aegistnet**

### STEP 2: Find Your API Key
1. Under "API Keys" section
2. Look for a key that starts with `AIzaSy...`
3. It should match your `.env` file: `AIzaSyUTjsHiCeRztnUmQW7153X_PQFoNkySmbc`

### STEP 3: Edit the Key
1. Click on the API Key name to open it
2. You'll see two important sections

### SECTION A: API Restrictions
**Current state:** May say "Restricted API"
**Change to:** "Don't restrict key"

Steps:
- Find "API restrictions" section
- Select: **"Don't restrict key"** (top option)
- This allows Firebase Auth to work

### SECTION B: Application Restrictions
**Current state:** May have domain/website restrictions
**Change to:** Add localhost URLs

Steps:
- Find "Application restrictions" section
- Select: **"HTTP referrers (websites)"**
- Click "Add an HTTP referrer"
- Add these URLs (one by one):
  ```
  http://localhost:*
  http://localhost:3000/*
  http://127.0.0.1:*
  http://127.0.0.1:3000/*
  ```

### STEP 4: Save Changes
- Click **SAVE** button
- Wait for the change to propagate (usually instant)

### STEP 5: Restart Development Server
```bash
# In your terminal, stop the server
Ctrl + C

# Clear cache
npm cache clean --force

# Restart
npm start
```

### STEP 6: Test Login
1. Go to http://localhost:3000
2. Try logging in with your credentials
3. Should work now!

---

## If Still Not Working

### Option A: Complete Unrestriction (Development Only)
1. Google Cloud Console → Credentials
2. Edit your API Key
3. Set:
   - **API restrictions:** "Don't restrict key"
   - **Application restrictions:** "None"
4. SAVE and restart

⚠️ **WARNING:** This is for development ONLY. Before production, add proper restrictions.

### Option B: Create New API Key
1. Google Cloud Console → Credentials
2. Click: **"+ Create Credentials"** → **"API Key"**
3. New key created
4. Edit immediately:
   - API restrictions: Don't restrict key
   - Application restrictions: HTTP referrers
   - Add: http://localhost:*
5. Copy the new API Key
6. Update `.env`:
   ```
   REACT_APP_FIREBASE_API_KEY=YOUR_NEW_KEY_HERE
   ```
7. Restart: `npm start`

### Option C: Check if Required APIs are Enabled
1. Go to: https://console.cloud.google.com/apis/enabled
2. Make sure these are enabled:
   - ✓ Cloud Firestore API
   - ✓ Firebase Realtime Database API
   - ✓ Firebase Authentication
   - ✓ Identity and Access Management API
3. If any are disabled, click "ENABLE"

---

## What's Happening
1. Your `.env` has correct credentials ✓
2. Firebase SDK initializes correctly ✓
3. But when signing in, the API Key doesn't have auth permission ✗

The API Key needs permission to:
- Call Firebase Auth endpoints
- Validate email/password
- Create auth tokens
- From `localhost:3000`

---

## Verification
After fixing, your login should:
1. Accept your email/password
2. Verify credentials with Firebase
3. Create auth session
4. Redirect to Dashboard
5. Load children from database

---

## Still Stuck?
1. Check browser console (F12) for exact error
2. Check if all APIs are enabled
3. Try creating a completely new API Key
4. Verify email/password exist in Firebase Auth
5. Check Firebase Security Rules allow read/write
