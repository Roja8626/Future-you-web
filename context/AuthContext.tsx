import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signup: (name: string, email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        setUserProfile(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUserProfile(null);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signup = async (name: string, email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Default profile
        const newProfile: UserProfile = {
            name,
            email,
            futureDescription: '',
            timeHorizon: '',
            emotionalFocus: '',
            language: 'en',
            hasCompletedSetup: false
        };

        // Create user document - wrapped in try-catch to prevent blocking signup
        try {
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                ...newProfile,
                createdAt: serverTimestamp(),
                userId: userCredential.user.uid
            });
            setUserProfile(newProfile);
        } catch (firestoreError) {
            console.error('Firestore error (non-blocking):', firestoreError);
            // Don't throw - user is created in Auth, Firestore doc can be created later
            // Still set local profile so app can function
            setUserProfile(newProfile);
        }

        return userCredential;
    };

    const login = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        setUser(null);
        setUserProfile(null);
        return signOut(auth);
    };

    const value = {
        user,
        userProfile,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
