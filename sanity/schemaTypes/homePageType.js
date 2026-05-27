import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home Page',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'internationalizedArrayString' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'internationalizedArrayText' }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'image', description: 'Recommended: 1200×630px' }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'el', title: 'Greek', type: 'array', of: [{ type: 'string' }] }),
          ],
        }),
        defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
        defineField({ name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title }
    },
  },
})
