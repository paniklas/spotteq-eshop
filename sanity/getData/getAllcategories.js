import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../lib/live';

export const getAllCategories = async (locale) => {
    const ALL_CATEGORIES_QUERY = defineQuery(`
        *[
            _type == 'category' &&
            status == true
        ] | order(sortOrder asc) {
            _id,
            "title": title[language == $locale][0].value,
            "slug": slugs[$locale].current,
            "description": description[language == $locale][0].value,
            "group": categoryGroup->slug.current,
            "groupTitle": categoryGroup->title[language == $locale][0].value,
            "groupSortOrder": categoryGroup->sortOrder,
            displayNumber,
            image,
            "imageAlt": imageAlt[language == $locale][0].value,
            status
        }
    `);
        try {
            // Use sanityFetch to send the query
            const categories = await sanityFetch({
                query: ALL_CATEGORIES_QUERY,
                params: { locale }
            });

            // Return the categories
            return categories.data || [];
        } catch (error) {
            console.error("Error fetching all categories", error);
            return [];
        }
}

export const getCategoriesByGroup = async (locale, groupSlug) => {
    if (!locale || !groupSlug) return []
    const CATEGORIES_BY_GROUP_QUERY = defineQuery(`
        *[_type == "category" && categoryGroup->slug.current == $groupSlug && status == true]
            | order(sortOrder asc) {
            _id,
            "title": title[language == $locale][0].value,
            "slug": slugs[$locale].current,
            "description": description[language == $locale][0].value,
            displayNumber,
            image,
            "imageAlt": imageAlt[language == $locale][0].value,
            sortOrder
        }
    `);
    try {
        const categories = await sanityFetch({
            query: CATEGORIES_BY_GROUP_QUERY,
            params: { locale, groupSlug }
        });
        return categories.data || [];
    } catch (error) {
        console.error("Error fetching categories by group", error);
        return [];
    }
}

export const getCategoryBySlug = async (slug, locale) => {
    if (!slug || !locale) return null
    const QUERY = defineQuery(`
        *[_type == "category" && slugs[$locale].current == $slug][0] {
            _id,
            "title": title[language == $locale][0].value,
            "slug": slugs[$locale].current,
            "description": description[language == $locale][0].value,
            "group": categoryGroup->slug.current
        }
    `)
    try {
        const result = await sanityFetch({ query: QUERY, params: { slug, locale } })
        return result.data || null
    } catch (error) {
        console.error("Error fetching category by slug", error)
        return null
    }
}