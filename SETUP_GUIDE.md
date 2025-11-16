# Parental Dashboard - Setup and Installation Guide

## ✅ Project Complete - Ready for Deployment

Your professional Parental Dashboard has been fully implemented with all requested features!

---

## 📋 Quick Start

### 1. Configure Firebase

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

---

## 🏗️ Project Structure

```
src/
├── App.js                      # Main app with routing
├── index.js                    # React entry point
├── index.css                   # Global styles
│
├── components/
│   ├── ChildCard.js           # Child device card preview
│   ├── Navbar.js              # Top navigation bar
│   └── ProtectedRoute.js       # Auth-protected route wrapper
│
├── config/
│   └── firebase.js            # Firebase initialization
│
├── contexts/
│   ├── AuthContext.js         # Authentication state management
│   └── ThemeContext.js        # Light/dark theme toggle
│
├── hooks/
│   └── useFirebase.js         # Firebase Realtime Database hooks
│       - useChildData()        # Get single child's data
│       - useChildrenList()     # Get all children for parent
│       - updateBlockedApp()    # Block/unblock app
│       - toggleDeviceLock()    # Lock/unlock device
│       - requestLocationRefresh() # Request location update
│
├── pages/
│   ├── Login.js               # Parent login page
│   ├── Dashboard.js           # Main dashboard with child cards
│   └── ChildDetails.js        # Detailed child management
│
├── utils/
│   └── constants.js           # Helper functions & constants
│
└── public/
    └── index.html             # HTML template
```

---

## ✨ Features Implemented

### 1️⃣ Parent Authentication
- ✅ Email/password login with Firebase Auth
- ✅ Forgot password functionality
- ✅ Session persistence
- ✅ Protected routes

### 2️⃣ Main Dashboard
- ✅ Child device cards with:
  - Child name and avatar
  - Online/offline status indicator
  - Last updated timestamp
  - Quick action buttons (View Details, View Apps, View Location)
  - Block/Unblock device buttons
- ✅ Responsive grid layout (mobile-friendly)
- ✅ Real-time sync with Firebase

### 3️⃣ Child Details Page
**Device Info Tab:**
- ✅ Child name, email, linked parent account
- ✅ Device active/paused toggle
- ✅ Emergency lock device button
- ✅ App deleted detection

**Apps Tab:**
- ✅ List of all installed apps from Firebase
- ✅ Search/filter functionality
- ✅ Block/unblock toggles for each app
- ✅ Real-time updates to Firebase
- ✅ App package name display

**Location Tab:**
- ✅ Google Maps integration with marker
- ✅ Current latitude/longitude display
- ✅ Refresh location button
- ✅ Fallback for when location unavailable

### 4️⃣ Firebase Integration
- ✅ Real-time Database listeners
- ✅ Update operations for:
  - Blocked apps (`childs/{childId}/apps/{index}/blocked`)
  - Device lock state (`childs/{childId}/deviceLocked`)
  - Location refresh request (`childs/{childId}/requestLocationRefresh`)
- ✅ Parent email-based child filtering

### 5️⃣ Design & UX
- ✅ Material-UI professional components
- ✅ Light/dark theme toggle
- ✅ Mobile-responsive layouts
- ✅ Parental-control visual aesthetic
- ✅ Clean navigation and intuitive UI
- ✅ Loading states and error handling
- ✅ Success notifications for actions

---

## 🗄️ Firebase Database Structure (Required)

Your Firebase Realtime Database should follow this structure:

```
{
  "users": {
    "{userId}": {
      "email": "parent@example.com",
      "name": "Parent Name"
    }
  },
  "parents": {
    "{parentId}": {
      "email": "parent@example.com",
      "name": "Parent Name"
    }
  },
  "childs": {
    "{childId}": {
      "name": "Child Name",
      "email": "child@example.com",
      "parentEmail": "parent@example.com",
      "deviceLocked": false,
      "appDeleted": false,
      "lastUpdated": 1700000000000,
      "requestLocationRefresh": false,
      "lastLocationRefresh": 1700000000000,
      "apps": [
        {
          "appName": "Facebook",
          "packageName": "com.facebook.katana",
          "blocked": false
        },
        {
          "appName": "Instagram",
          "packageName": "com.instagram.android",
          "blocked": true
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

## 🔐 Authentication Flow

1. Parent visits `/login`
2. Enters email and password
3. Firebase authenticates credentials
4. On success, redirected to `/dashboard`
5. Session persists via Firebase `onAuthStateChanged`
6. Logout removes session and redirects to login

---

## 🔄 Real-Time Data Sync

The app automatically listens to Firebase Realtime Database:

- **useChildrenList()**: Filters children by `parentEmail`, auto-updates when data changes
- **useChildData()**: Listens to specific child data, triggers re-render on changes
- **Updates**: When parent toggles app blocks or locks device, data is written immediately
- **Location**: Parent can request refresh; child app listens for `requestLocationRefresh` flag

---

## 🎨 Theme Customization

**Theme Toggle:**
- Click the brightness icon in navbar to switch between light/dark mode
- State persists in React Context during session

**Colors:**
- Primary: Blue (#1976D2 light, #90CAF9 dark)
- Secondary: Pink (#DC004E light, #F48FB1 dark)
- Backgrounds: Auto-adjusted for light/dark mode

To customize colors, edit `src/contexts/ThemeContext.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#YOUR_COLOR',
    },
    // ... more options
  },
});
```

---

## 📱 Mobile Responsiveness

All pages are fully responsive:
- **Desktop**: Grid layout with 3+ columns
- **Tablet**: 2 columns
- **Mobile**: Single column, full-width cards

Breakpoints configured in Material-UI:
- xs: 0px
- sm: 600px
- md: 960px
- lg: 1280px

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Alternative Hosting (Netlify, Vercel, etc.)
```bash
# Netlify
npm run build
# Connect `build/` folder to Netlify

# Vercel
vercel --prod
```

---

## 🛠️ Environment Variables

Required `.env` variables:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_DATABASE_URL`
- `REACT_APP_GOOGLE_MAPS_API_KEY`

**Important**: Never commit `.env` to version control. Use `.env.example` as template.

---

## 📦 Dependencies

- **react** (18.2.0): UI library
- **react-router-dom** (6.20.0): Navigation
- **firebase** (10.7.0): Backend & auth
- **@mui/material** (5.14.0): Component library
- **@react-google-maps/api** (2.19.0): Maps integration
- **date-fns** (2.30.0): Date formatting

---

## 🐛 Troubleshooting

### Firebase Connection Error
- Verify `.env` values match your Firebase project
- Check Realtime Database rules allow read/write
- Ensure Firebase SDK is initialized before use

### Map Not Showing
- Add `REACT_APP_GOOGLE_MAPS_API_KEY` to `.env`
- Enable Maps JavaScript API in Google Cloud Console
- Restrict key to your domain

### Children Not Showing on Dashboard
- Verify child data in Firebase matches `parentEmail` format
- Check that `childs/{childId}/parentEmail` matches logged-in user email
- Ensure `lastUpdated` timestamp is set

### Blank Screen After Login
- Check browser console for errors
- Verify protected routes are configured
- Ensure `useAuth()` hook is available in context

---

## 📝 Development Notes

### Adding New Features
1. Create component in `src/components/` or page in `src/pages/`
2. Use Material-UI components for consistency
3. Add new routes to `App.js`
4. Use `useAuth()` for authentication context
5. Use `useTheme()` for theme consistency

### Firebase Rules (Example)
```json
{
  "rules": {
    "childs": {
      "$childId": {
        ".read": "root.child('parents').child(auth.uid).child('email').val() == data.child('parentEmail').val()",
        ".write": "root.child('parents').child(auth.uid).child('email').val() == data.child('parentEmail').val()"
      }
    }
  }
}
```

---

## ✅ Testing Checklist

- [ ] Login works with valid credentials
- [ ] Forgot password sends reset email
- [ ] Dashboard shows child cards
- [ ] Online/offline indicator updates
- [ ] Device details page loads
- [ ] App list displays and search works
- [ ] App block/unblock toggles update Firebase
- [ ] Device lock toggle works
- [ ] Location map displays (if location available)
- [ ] Location refresh button works
- [ ] Theme toggle changes colors
- [ ] Mobile layout is responsive
- [ ] Logout works and clears session

---

## 📞 Support

For issues or questions:
1. Check console errors (F12 in browser)
2. Verify Firebase configuration
3. Check network tab for API calls
4. Review Firebase database for data structure

---

**Built with React 18, Firebase, Material-UI, and Google Maps**
**No Vite - Create React App with Webpack**
