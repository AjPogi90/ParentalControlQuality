import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../config/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Signup helper: creates Firebase Auth user and writes a parent profile to Realtime Database
  const signup = async (email, password, name) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCred.user;
      if (name) {
        await updateProfile(createdUser, { displayName: name });
      }
      // write parent profile
      await set(ref(database, `users/parents/${createdUser.uid}`), {
        uid: createdUser.uid,
        email: createdUser.email,
        name: name || '',
        createdAt: Date.now(),
        role: 'parent',
      });

      let verificationSent = false;
      try {
        await sendEmailVerification(createdUser);
        verificationSent = true;
      } catch (e) {
        // leave verificationSent false and return error info to caller
        console.warn('sendEmailVerification failed:', e);
      }

      return { success: true, user: createdUser, verificationSent };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
