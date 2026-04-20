export const getStylesForCurrentPage = (pathname, locale, backgroundColor = null) => {

    const isColorDark = (hexColor) => {
        if (!hexColor || typeof hexColor !== 'string') return true; // Default to dark
        
        // Remove the # if it exists
        const hex = hexColor.replace('#', '');
        
        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Calculate brightness (using a common formula)
        // Higher values indicate lighter colors
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // If brightness is less than 128, consider it dark
        return brightness < 128;
    };

    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
        return {
            color: '#000000',
            text: 'text-black-custom',
            burger: 'bg-black-custom',
            textHover: 'hover:text-black-custom',
            border: 'border-black-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-white-custom',
            backgroundHoverPlano: 'hover:bg-black-custom'
        };
    }

    // For about page
    if (pathname.includes('/about')) {
        return {
            color: '#000000',
            text: 'text-black-custom',
            burger: 'bg-black-custom',
            textHover: 'hover:text-black-custom',
            border: 'border-black-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-white-custom',
            backgroundHoverPlano: 'hover:bg-black-custom'
        };
    }

    // For projects page
    if (pathname.includes('/projects') && !pathname.match(/\/projects\/[^/]+$/)) {
        return {
            color: '#000000',
            text: 'text-black-custom',
            burger: 'bg-black-custom',
            textHover: 'hover:text-black-custom',
            border: 'border-black-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-white-custom',
            backgroundHoverPlano: 'hover:bg-black-custom'
        };
    }

    // For individual project page (projects/[slug])
    if (pathname.match(/\/projects\/[^/]+$/)) {
        return {
            color: '#ffffff',
            text: 'text-white-custom',
            burger: 'bg-white-custom',
            textHover: 'hover:text-white-custom',
            border: 'border-white-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-black-custom',
            backgroundHoverPlano: 'hover:bg-white-custom'
        };
    }

    // For contact page
    if (pathname.includes('/contact')) {
        return {
            color: '#000000',
            text: 'text-black-custom',
            burger: 'bg-black-custom',
            textHover: 'hover:text-black-custom',
            border: 'border-black-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-white-custom',
            backgroundHoverPlano: 'hover:bg-black-custom'
        };
    }

    // For shop pages
    if (pathname.includes('/shop')) {
        return {
            color: '#000000',
            text: 'text-black-custom',
            burger: 'bg-black-custom',
            textHover: 'hover:text-black-custom',
            border: 'border-black-custom',
            borderHover: 'hover:border-teal-custom',
            background: 'bg-transparent',
            backgroundHover: 'hover:bg-teal-custom',
            textHoverPlano: 'hover:text-white-custom',
            backgroundHoverPlano: 'hover:bg-black-custom'
        };
    }

    // Default fallback
    return {
        color: '#000000',
        text: 'text-black-custom',
        burger: 'bg-black-custom',
        textHover: 'hover:text-teal-custom',
        border: 'border-black-custom',
        borderHover: 'hover:border-teal-custom',
        background: 'bg-transparent',
        backgroundHover: 'hover:bg-teal-custom',
        textHoverPlano: 'hover:text-white-custom',
        backgroundHoverPlano: 'hover:bg-black-custom'
    };
};