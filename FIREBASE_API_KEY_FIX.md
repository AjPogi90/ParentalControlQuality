# 🔧 Firebase API Key Error - Fix Guide

## Error: "auth/api-key-not-valid.-please-pass-a-valid-api-key."

This error occurs when:
1. The API key is invalid or expired
2. The API key doesn't have proper credentials
3. Environment variables are not loaded correctly
4. Firebase SDK not initialized properly

---

## ✅ Solution Steps

### Step 1: Verify Your Credentials
Go to [Firebase Console](https://console.firebase.google.com)

1. Click on your project: **AegistNet**
2. Go to **Settings** (gear icon) → **Project Settings**
3. Look for your config object under "Your apps"
4. You should see all credentials listed

### Step 2: Get Fresh Credentials

1. In Firebase Console, go to **Settings** → **Service Accounts**
2. Click **Create private key** (for Node.js - web config might already exist)
3. Copy the **Web App Configuration** - it should look like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### Step 3: Update .env File

Replace your `.env` with the correct values:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
```

### Step 4: Verify API Key is Enabled

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your API Key in the list
5. Click on it and verify:
   - [ ] Key is not restricted to specific domains (or includes your domain)
   - [ ] Key has access to all APIs (for development)
   - [ ] Application restrictions: Select "HTTP referrers" and add your domain

### Step 5: Restart Development Server

After updating `.env`:

```bash
# Stop the server (Ctrl+C)
# Clear cache
npm cache clean --force

# Restart
npm start
```

---

## 🔑 How to Get Firebase Config

**Easy Way:**
1. Go to Firebase Console
2. Click your project
3. Click the web app (the `</>` icon)
4. Copy the entire config object
5. Paste it into `.env`

---

## ⚠️ Common Issues

### Issue: "REACT_APP_* not recognized"
**Solution:** 
- Variables must start with `REACT_APP_` (for Create React App)
- Restart dev server after changing `.env`
- Variables are only loaded at build time

### Issue: "API Key restrictions"
**Solution:**
- In Google Cloud Console → API Keys
- Edit your key
- Set Application restrictions to "None" for development
- For production, set specific domain restrictions

### Issue: "Invalid auth domain"
**Solution:**
- Make sure authDomain includes `.firebaseapp.com`
- Example: `aegistnet.firebaseapp.com` (NOT just `aegistnet`)

### Issue: "Database URL not found"
**Solution:**
- Go to Realtime Database in Firebase
- Check if database is created
- Copy the URL from database settings

---

## 🧪 Test Firebase Connection

Add this to your browser console:

```javascript
// Check if environment variables are loaded
console.log(process.env);
console.log(process.env.REACT_APP_FIREBASE_PROJECT_ID);
```

If undefined, restart your dev server.

---

## 📋 Step-by-Step: Copy Fresh Config

1. **Open Firebase Console**
   - URL: https://console.firebase.google.com

2. **Select Project: AegistNet**

3. **Add Web App if not exists**
   - Settings (gear) → Project Settings
   - Look for "Your apps" section
   - If no web app, click "Add app" → select Web

4. **Copy Config**
   ```javascript
   // Your web app's Firebase config
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "aegistnet.firebaseapp.com",
     projectId: "aegistnet",
     storageBucket: "aegistnet.firebasestorage.app",
     messagingSenderId: "468468639315",
     appId: "1:468468639315:web:64a5197a2e99c7357388a6"
   };
   ```

5. **Add to .env**
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   REACT_APP_FIREBASE_AUTH_DOMAIN=aegistnet.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=aegistnet
   REACT_APP_FIREBASE_STORAGE_BUCKET=aegistnet.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=468468639315
   REACT_APP_FIREBASE_APP_ID=1:468468639315:web:64a5197a2e99c7357388a6
   REACT_APP_FIREBASE_DATABASE_URL=https://aegistnet-default-rtdb.firebaseio.com
   ```

6. **Restart Server**
   ```bash
   # Stop (Ctrl+C)
   npm start
   ```

---

## 📞 Still Not Working?

Check:
- [ ] `.env` file exists and has correct values
- [ ] Dev server restarted after `.env` change
- [ ] No typos in variable names (must start with `REACT_APP_`)
- [ ] API Key is not restricted
- [ ] Firebase project is active
- [ ] Browser console shows the correct values

---

## 🆘 Debug Steps

```bash
# Clear everything
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Run dev server
npm start
```

---

**For more help:** Check Firebase docs: https://firebase.google.com/docs/web/setup
