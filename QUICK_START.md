# 🚀 Quick Start Reference

## In 3 Minutes

### Step 1: Configure Firebase
```bash
# Copy template
cp .env.example .env

# Edit .env with your Firebase project credentials
# - Get from Firebase Console > Project Settings
```

### Step 2: Start Development
```bash
npm start
# Opens http://localhost:3000
```

### Step 3: Test
- Login with email/password (must exist in Firebase Auth)
- View dashboard (requires child records in Firebase)
- Interact with child cards and details

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.js` | Routes & main app |
| `src/pages/Login.js` | Authentication |
| `src/pages/Dashboard.js` | Child overview |
| `src/pages/ChildDetails.js` | Child management |
| `src/components/Navbar.js` | Top bar & theme |
| `src/hooks/useFirebase.js` | Database hooks |
| `src/config/firebase.js` | Firebase setup |

---

## Commands

```bash
npm start          # Development (port 3000)
npm run build      # Production build
npm test           # Run tests
npm audit fix      # Fix vulnerabilities
```

---

## Database Schema

```javascript
// Add test data to Firebase Realtime Database
{
  "childs": {
    "child1": {
      "name": "Sarah",
      "email": "sarah@example.com",
      "parentEmail": "parent@example.com",
      "deviceLocked": false,
      "lastUpdated": Date.now(),
      "apps": [
        {
          "appName": "TikTok",
          "packageName": "com.ss.android.ugc.tiktok",
          "blocked": false
        }
      ],
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
  }
}
```

---

## URLs

After Login:
- `/dashboard` - Main view
- `/child/:childId` - Details view
- `/child/:childId?tab=apps` - Apps tab
- `/child/:childId?tab=location` - Location tab

---

## Features

| Feature | Status |
|---------|--------|
| Login/Auth | ✅ Complete |
| Dashboard | ✅ Complete |
| App Control | ✅ Complete |
| Device Lock | ✅ Complete |
| Location Map | ✅ Complete |
| Theme Toggle | ✅ Complete |
| Responsive | ✅ Complete |

---

## Environment Variables

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_GOOGLE_MAPS_API_KEY=
```

Get these from:
1. Firebase Console > Project Settings
2. Google Cloud Console > API Keys

---

## Common Issues

**"Cannot find module 'firebase'"**
```bash
npm install
```

**Map not showing**
- Add `REACT_APP_GOOGLE_MAPS_API_KEY` to `.env`

**No children on dashboard**
- Check Firebase data has matching `parentEmail`

**Blank after login**
- Check browser console (F12) for errors

---

## Deployment

```bash
# Build
npm run build

# Firebase Hosting
firebase deploy --only hosting

# Netlify
vercel --prod

# Check for issues
npm audit
```

---

**For detailed docs see: SETUP_GUIDE.md**
