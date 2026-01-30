import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { LanguageCode } from '../../types';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';

interface AuthContainerProps {
    onAuth: (name: string, email: string) => void;
    lang: LanguageCode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuth, lang }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            onAuth(user.displayName || '', user.email || '');
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message);
        }
    };

    const handleSignup = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
                onAuth(name, email);
            }
        } catch (err: any) {
            console.error("Signup Error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
            {error && (
                <div className="mb-4 p-4 bg-red-100/80 text-red-700 rounded-xl border border-red-200">
                    {error}
                </div>
            )}
            {isLogin ? (
                <LoginForm
                    onLogin={handleLogin}
                    lang={lang}
                    onSwitch={() => setIsLogin(false)}
                />
            ) : (
                <SignupForm
                    onSignup={handleSignup}
                    lang={lang}
                    onSwitch={() => setIsLogin(true)}
                />
            )}
        </div>
    );
};

export default AuthContainer;
