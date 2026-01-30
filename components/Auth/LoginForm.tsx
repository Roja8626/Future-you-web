import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { t, isRTL } from '../../utils/translations';
import { LanguageCode } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
    lang: LanguageCode;
}

const LoginForm: React.FC<LoginFormProps> = ({ lang }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err: any) {
            console.error("Login Error:", err);
            setLoading(false); // CRITICAL: Reset loading on error

            // User-friendly error messages
            const errorMessages: Record<string, string> = {
                'auth/invalid-credential': 'Invalid email or password',
                'auth/user-not-found': 'Invalid email or password',
                'auth/wrong-password': 'Invalid email or password',
                'auth/too-many-requests': 'Too many attempts. Please try again later.',
                'auth/network-request-failed': 'Network error. Please check your connection',
            };
            setError(errorMessages[err.code] || 'Failed to login. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
            <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-8 animate-fade-in" dir={isRTL(lang) ? 'rtl' : 'ltr'}>

                {error && (
                    <div className="p-4 bg-red-100/80 text-red-700 rounded-xl border border-red-200 text-center">
                        {error}
                    </div>
                )}

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif text-warm-900">{t(lang, 'auth_login_title')}</h2>
                    <p className="text-warm-500">{t(lang, 'auth_login_subtitle')}</p>
                </div>

                <div className="space-y-6">
                    <div className="group">
                        <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Button onClick={handleLogin} disabled={!email || !password || loading}>
                        {loading ? 'Logging in...' : t(lang, 'cta_login')}
                    </Button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full text-center text-sm text-warm-500 hover:text-warm-800 transition-colors"
                    >
                        {t(lang, 'auth_switch_to_signup')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
