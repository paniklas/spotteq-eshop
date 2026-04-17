// Reusable function to generate metadata for any page type
export function createMetadata(pageData, locale, pagePath = '') {
    
    if (!pageData || !pageData.seo) {
        return {
            title: 'Default Title',
            description: 'Default description',
        };
    }
    
    const { metaTitle, metaDescription, ogImage, canonicalUrl, noIndex, keywords } = pageData.seo;
    
    // Base URL for your site
    const baseUrl = 'https://www.fts-georgiou.gr';
    
    // Base metadata object
    const metadata = {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            images: ogImage?.url 
            ? [
                {
                    url: ogImage.url,
                    width: 1200,
                    height: 630,
                    alt: metaTitle
                }
                ] 
            : []
        }
    };
    
    // Add keywords if they exist
    // With the new query, keywords should be an array of strings
    if (keywords && Array.isArray(keywords)) {
        // Filter out any undefined or empty values
        const filteredKeywords = keywords.filter(keyword => keyword);
        if (filteredKeywords.length > 0) {
            // Next.js 16 supports keywords as an array
            metadata.keywords = filteredKeywords;
        }
    }
    
    // Path segment for the current page
    const pathSegment = pagePath ? `/${pagePath}` : '';
    
    // Always set alternates with language options
    metadata.alternates = {
        // Language alternates
        languages: {
            'en': `${baseUrl}/en${pathSegment}`,
            'el': `${baseUrl}/el${pathSegment}`
        }
    };
    
    // Add canonical URL if it exists
    if (canonicalUrl) {
        metadata.alternates.canonical = canonicalUrl;
    } else {
        // If no custom canonical URL is provided, use the current URL as canonical
        metadata.alternates.canonical = `${baseUrl}/${locale}${pathSegment}`;
    }
    
    // Add robots directive if noIndex is true
    if (noIndex) {
        metadata.robots = {
            index: false,
            follow: true
        };
    }
    
    return metadata;
}