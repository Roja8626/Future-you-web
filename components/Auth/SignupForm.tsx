import React, { useState } from 'react';
import Button from '../Button';
import { t, isRTL } from '../../utils/translations';
import { LanguageCode } from '../../types';

interface SignupFormProps {
    onSignup: (name: string, email: string, password: string) => void;
    lang: LanguageCode;
    onSwitch: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, lang, onSwitch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isValid = name && email && password && confirmPassword && (password === confirmPassword);

    return (
        <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-8 animate-fade-in" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif text-warm-900">{t(lang, 'auth_signup_title')}</h2>
                <p className="text-warm-500">{t(lang, 'auth_signup_subtitle')}</p>
            </div>

            <div className="space-y-5">
                <div className="group">
                    <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_name')}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
                    />
                </div>
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
                <div className="group">
                    <label className="block text-sm font-medium text-warm-500 mb-2 ml-1 transition-colors group-focus-within:text-lavender-600">{t(lang, 'input_confirm_password')}</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/50 border border-warm-100 focus:outline-none focus:ring-2 focus:ring-lavender-200 focus:bg-white transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(233,213,255,0.2)]"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Button onClick={() => onSignup(name, email, password)} disabled={!isValid}>
                    {t(lang, 'cta_signup')}
                </Button>
                <button
                    onClick={onSwitch}
                    className="w-full text-center text-sm text-warm-500 hover:text-warm-800 transition-colors"
                >
                    {t(lang, 'auth_switch_to_login')}
                </button>
            </div>
        </div>
    );
};

export default SignupForm;
