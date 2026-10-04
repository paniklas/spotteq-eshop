'use client'

import { useEffect } from 'react';

export default function LocaleLanguageSetter({ locale }) {
    useEffect(() => {
        if (locale && document) {
        document.documentElement.lang = locale;
        // UserWay (Auto-Detect) reads <html lang> only once at startup, so a
        // client-side locale switch must tell it. Before it has loaded this is
        // a no-op: it will pick up the lang set above when it starts.
        window.UserWay?.changeWidgetLanguage?.(locale);
        }
    }, [locale]);
  
    // This component doesn't render anything visible
    return null;
}