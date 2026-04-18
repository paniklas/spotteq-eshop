'use client'

import { useEffect } from 'react';

export default function LocaleLanguageSetter({ locale }) {
    useEffect(() => {
        if (locale && document) {
        document.documentElement.lang = locale;
        }
    }, [locale]);
  
    // This component doesn't render anything visible
    return null;
}