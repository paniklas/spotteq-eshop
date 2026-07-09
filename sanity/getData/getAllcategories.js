import { defineQuery } from 'next-sanity';
import { catalogFetch } from '../lib/catalogFetch';

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
            const categories = await catalogFetch({
                query: ALL_CATEGORIES_QUERY,
                params: { locale },
                tags: ['categories'],
            });

            return categories || [];
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
        const categories = await catalogFetch({
            query: CATEGORIES_BY_GROUP_QUERY,
            params: { locale, groupSlug },
            tags: ['categories'],
        });
        return categories || [];
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
        const category = await catalogFetch({
            query: QUERY,
            params: { slug, locale },
            tags: [`category:${slug}`, 'categories'],
        })
        return category || null
    } catch (error) {
        console.error("Error fetching category by slug", error)
        return null
    }
}
