# Firebase API Key Error - Complete Fix Guide

## Error: "auth/api-key-not-valid.-please-pass-a-valid-api-key."

This error occurs when Firebase Authentication cannot validate your API key during login.

---

## Root Causes

1. **API Key has restrictive permissions** - Can't access Firebase Auth APIs
2. **API Key is invalid or expired** - Needs to be regenerated
3. **Domain restrictions too strict** - Doesn't allow localhost access
4. **API Key not linked to correct Firebase project**

---

## Solution 1: Regenerate API Key (Recommended)

### Step-by-Step

#### 1. Go to Google Cloud Console
```
https://console.cloud.google.com/apis/credentials?project=aegistnet
```

#### 2. Verify Project
- Dropdown at top should show: **aegistnet**
- If not, select it

#### 3. Find API Keys Section
- Look for "API Keys" heading
- Find your current key: `AIzaSyUTjsHiCeRztnUmQW7153X_PQFoNkySmbc`

#### 4. Delete Old Key (Optional but Recommended)
- Hover over the key
- Click trash icon
- Confirm deletion

#### 5. Create New API Key
- Click **"+ Create Credentials"** button
- Select **"API Key"**
- New key is created and displayed
- Copy the new key value

#### 6. Update Your .env File
```bash
# OLD (delete this line)
REACT_APP_FIREBASE_API_KEY=AIzaSyUTjsHiCeRztnUmQW7153X_PQFoNkySmbc

# NEW (add this)
REACT_APP_FIREBASE_API_KEY=YOUR_NEW_KEY_COPIED_FROM_GOOGLE_CLOUD
```

#### 7. Restart Dev Server
```bash
# In terminal:
Ctrl + C  # Stop current server

npm start # Restart
```

#### 8. Test Login
- Go to: http://localhost:3000
- Enter credentials:
  - Email: `ajlolong15@gmail.com`
  - Password: (your password)
- Should work now!

---

## Solution 2: Configure Existing Key (If You Want to Keep It)

### Step-by-Step

#### 1. Open Google Cloud Credentials
```
https://console.cloud.google.com/apis/credentials?project=aegistnet
```

#### 2. Click Your API Key
- Find the key in the list
- Click on it to edit

#### 3. Set API Restrictions
```
CHANGE FROM: Restricted API selection
CHANGE TO: Don't restrict key
```

Scroll down and:
- Find "API restrictions" dropdown
- Select **"Don't restrict key"** (top option)

#### 4. Set Application Restrictions
```
CHANGE FROM: Any existing restrictions
CHANGE TO: HTTP referrers
```

- Find "Application restrictions" section
- Select: **"HTTP referrers (websites)"**
- Add these URLs (click "Add an HTTP referrer" multiple times):
  ```
  http://localhost:*
  http://localhost:3000
  http://localhost:3000/*
  http://127.0.0.1:*
  http://127.0.0.1:3000
  ```

#### 5. Save Changes
- Click **SAVE** button
- Wait for confirmation

#### 6. Restart Dev Server
```bash
Ctrl + C
npm start
```

#### 7. Test Login
- Go to: http://localhost:3000
- Try login again

---

## Solution 3: Check Firebase Authentication Setup

If the above doesn't work, verify Firebase Auth is properly configured:

#### 1. Go to Firebase Console
```
https://console.firebase.google.com
```

#### 2. Select Project: AegistNet

#### 3. Go to Authentication
- Left sidebar → Build → Authentication
- Click **"Get started"** if you haven't already

#### 4. Enable Email/Password
- Click **"Email/Password"** option
- Toggle switch to **ON**
- Click **SAVE**

#### 5. Verify Your Account Exists
- In Authentication page, look for "Users" tab
- You should see: `ajlolong15@gmail.com`
- If not, create test user:
  - Click "Add user"
  - Email: `ajlolong15@gmail.com`
  - Password: (set a test password)
  - Click "Create user"

#### 6. Restart Server & Test
```bash
npm start
```

---

## Solution 4: Enable Required APIs

The Firebase project needs these APIs enabled:

### Check if Enabled

1. Go to: https://console.cloud.google.com/apis/enabled?project=aegistnet

2. Search for and verify these are enabled:
   - ✅ **Firebase Authentication**
   - ✅ **Firebase Realtime Database API**
   - ✅ **Identity and Access Management API**
   - ✅ **Google Identity Toolkit API**
   - ✅ **Firebase Cloud Messaging API**

### Enable Missing APIs

For each missing API:
1. Click it
2. Click **"ENABLE"** button
3. Wait for enablement to complete

### Then Restart
```bash
npm start
```

---

## Troubleshooting

### Still Getting "api-key-not-valid" Error?

1. **Clear browser cache**: F12 → Application → Clear Storage
2. **Clear npm cache**: `npm cache clean --force`
3. **Reinstall dependencies**: `npm install`
4. **Create completely new API key**: Delete old one and create new one
5. **Check .env is saved**: Make sure you saved the .env file after changes
6. **Verify .env variables**: Make sure no typos in REACT_APP_FIREBASE_API_KEY

### Still Not Working?

Try this nuclear option:

```bash
# Stop server
Ctrl + C

# Clean everything
npm cache clean --force
rm node_modules package-lock.json
npm install

# Restart
npm start
```

---

## Your Setup Details

**Project:** aegistnet
**Database URL:** aegistnet-default-rtdb.firebaseio.com
**Parent Email:** ajlolong15@gmail.com
**Parent Password:** (you know it)
**Child:** AJ (arnoldjaylolong15@gmail.com)

Your database has all the data ready. Just need the API key working!

---

## Next Steps After Login Works

Once you can login:

1. **Dashboard loads** → Shows child "AJ"
2. **Click "Details"** → Opens child details page
3. **Three tabs available:**
   - Device Info (lock/unlock controls)
   - Apps (view AegistNet app, toggle blocks)
   - Location (map showing Washington DC area)

---

## Questions?

The most common cause is API key restrictions. Try **Solution 1** (regenerate key) first - it's usually the fastest fix.

If regenerating doesn't work, **Solution 3** (Firebase Auth setup) is the next best bet.
