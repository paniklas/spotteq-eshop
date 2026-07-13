'use client';

import { useSignIn } from '@clerk/nextjs/legacy';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
    );
}

function Spinner() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin mx-auto" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 mb-2">
                <div className="h-9 bg-gray-light rounded-xl animate-pulse w-2/3" />
                <div className="h-4 bg-gray-light rounded-xl animate-pulse w-full" />
            </div>
            <div className="h-12 bg-gray-light rounded-xl animate-pulse" />
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-mint" /><div className="w-6 h-3 bg-gray-light rounded animate-pulse" /><div className="flex-1 h-px bg-gray-mint" /></div>
            <div className="h-12 bg-gray-light rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-light rounded-xl animate-pulse" />
        </div>
    );
}

const INPUT = "w-full border border-gray-mint rounded-xl px-4 py-3 font-aeonik text-[14px] text-black-custom placeholder:text-gray-text/60 focus:border-black-custom focus:outline-none transition-colors";
const BTN = "w-full rounded-xl py-3 font-aeonik text-[14px] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center";
const LINK_BTN = "font-aeonik text-[13px] text-gray-text text-center hover:text-black-custom underline cursor-pointer bg-transparent border-none p-0 w-full";

export default function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState('identifier');
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('auth');

    const clerkError = (err) =>
        err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || t('genericError');

    const handleGoogle = async () => {
        if (!isLoaded || googleLoading) return;
        setError('');
        setGoogleLoading(true);
        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/${locale}/account`,
            });
            // On success the browser redirects away, so no need to reset the flag.
        } catch (err) {
            setError(clerkError(err));
            setGoogleLoading(false);
        }
    };

    const handleEmailContinue = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await signIn.create({ identifier: email });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push(`/${locale}/account`);
                return;
            }
            const hasPassword = result.supportedFirstFactors?.some(f => f.strategy === 'password');
            if (hasPassword) {
                setStep('password');
            } else {
                setError(t('unsupportedMethod'));
            }
        } catch (err) {
            setError(clerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await signIn.attemptFirstFactor({ strategy: 'password', password });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push(`/${locale}/account`);
            } else {
                setError(t('signInIncomplete'));
            }
        } catch (err) {
            setError(clerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSend = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);
        setError('');
        try {
            await signIn.create({ strategy: 'reset_password_email_code', identifier: email });
            setStep('reset');
        } catch (err) {
            setError(clerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: resetCode,
                password: newPassword,
            });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push(`/${locale}/account`);
            } else {
                setError(t('signInIncomplete'));
            }
        } catch (err) {
            setError(clerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) return <LoadingSkeleton />;

    return (
        <div className="flex flex-col gap-5">
            {/* ── identifier ── */}
            {step === 'identifier' && (
                <>
                    <div className="mb-2">
                        <h1 className="font-aeonik text-[28px] xl:text-[32px] text-black-custom mb-1">{t('signInTitle')}</h1>
                        <p className="font-aeonik text-[14px] text-gray-text">{t('signInSubtitle')}</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={googleLoading}
                        className={`${BTN} bg-white-custom text-black-custom border border-gray-mint hover:bg-gray-light`}
                    >
                        {googleLoading ? <Spinner /> : (
                            <>
                                <GoogleIcon />
                                <span className="ml-3">{t('continueWithGoogle')}</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-mint" />
                        <span className="font-aeonik text-[12px] text-gray-text">{t('or')}</span>
                        <div className="flex-1 h-px bg-gray-mint" />
                    </div>

                    <form onSubmit={handleEmailContinue} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-aeonik text-[13px] text-black-custom">{t('emailLabel')}</label>
                            <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={INPUT} />
                        </div>
                        {error && <p className="font-aeonik text-[12px] text-orange-accent">{error}</p>}
                        <button type="submit" disabled={isLoading} className={`${BTN} bg-black-custom text-white-custom hover:bg-black-custom/90`}>
                            {isLoading ? <Spinner /> : t('continue')}
                        </button>
                    </form>

                    <p className="font-aeonik text-[13px] text-gray-text text-center">
                        {t('noAccount')}{' '}
                        <Link href="/sign-up" className="text-black-custom underline hover:text-black-custom/70">{t('signUpLink')}</Link>
                    </p>
                </>
            )}

            {/* ── password ── */}
            {step === 'password' && (
                <>
                    <div className="mb-2">
                        <h1 className="font-aeonik text-[28px] xl:text-[32px] text-black-custom mb-1">{t('enterPassword')}</h1>
                        <p className="font-aeonik text-[14px] text-gray-text">{t('signingInAs')} <span className="text-black-custom">{email}</span></p>
                    </div>

                    <form onSubmit={handlePassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="font-aeonik text-[13px] text-black-custom">{t('passwordLabel')}</label>
                                <button type="button" onClick={() => { setStep('forgot'); setError(''); }} className="font-aeonik text-[12px] text-gray-text hover:text-black-custom underline cursor-pointer">
                                    {t('forgotPassword')}
                                </button>
                            </div>
                            <input type="password" required autoComplete="current-password" autoFocus value={password} onChange={e => setPassword(e.target.value)} className={INPUT} />
                        </div>
                        {error && <p className="font-aeonik text-[12px] text-orange-accent">{error}</p>}
                        <button type="submit" disabled={isLoading} className={`${BTN} bg-black-custom text-white-custom hover:bg-black-custom/90`}>
                            {isLoading ? <Spinner /> : t('signIn')}
                        </button>
                    </form>

                    <button type="button" onClick={() => { setStep('identifier'); setError(''); }} className={LINK_BTN}>
                        {t('useDifferentEmail')}
                    </button>
                </>
            )}

            {/* ── forgot password ── */}
            {step === 'forgot' && (
                <>
                    <div className="mb-2">
                        <h1 className="font-aeonik text-[28px] xl:text-[32px] text-black-custom mb-1">{t('forgotPasswordTitle')}</h1>
                        <p className="font-aeonik text-[14px] text-gray-text">{t('forgotPasswordDesc')}</p>
                    </div>

                    <form onSubmit={handleForgotSend} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-aeonik text-[13px] text-black-custom">{t('emailLabel')}</label>
                            <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={INPUT} />
                        </div>
                        {error && <p className="font-aeonik text-[12px] text-orange-accent">{error}</p>}
                        <button type="submit" disabled={isLoading} className={`${BTN} bg-black-custom text-white-custom hover:bg-black-custom/90`}>
                            {isLoading ? <Spinner /> : t('sendResetEmail')}
                        </button>
                    </form>

                    <button type="button" onClick={() => { setStep('password'); setError(''); }} className={LINK_BTN}>
                        {t('backToSignIn')}
                    </button>
                </>
            )}

            {/* ── reset password ── */}
            {step === 'reset' && (
                <>
                    <div className="mb-2">
                        <h1 className="font-aeonik text-[28px] xl:text-[32px] text-black-custom mb-1">{t('resetPasswordTitle')}</h1>
                        <p className="font-aeonik text-[14px] text-gray-text">{t('resetPasswordDesc')}</p>
                    </div>

                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-aeonik text-[13px] text-black-custom">{t('verificationCode')}</label>
                            <input type="text" required autoComplete="one-time-code" value={resetCode} onChange={e => setResetCode(e.target.value)} className={INPUT} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-aeonik text-[13px] text-black-custom">{t('newPassword')}</label>
                            <input type="password" required autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={INPUT} />
                        </div>
                        {error && <p className="font-aeonik text-[12px] text-orange-accent">{error}</p>}
                        <button type="submit" disabled={isLoading} className={`${BTN} bg-black-custom text-white-custom hover:bg-black-custom/90`}>
                            {isLoading ? <Spinner /> : t('resetPassword')}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
