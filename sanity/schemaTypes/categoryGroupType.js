import { defineField, defineType } from 'sanity'

export const categoryGroupType = defineType({
  name: 'categoryGroup',
  title: 'Category Group',
  type: 'document',
  description: 'Groups that appear as sections in the UI (e.g. "Series", "Goal", "Accessories")',
  fields: [
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 96,
        source: (doc) => {
          const titles = doc.title
          if (!Array.isArray(titles)) return ''
          const entry = titles.find(t => t._key === 'en') || titles[0]
          return entry?.value || ''
        },
      },
      validation: Rule => Rule.required(),
      description: 'Auto-generated from the title — click Generate. Never change this after products are assigned.',
    }),
    defineField({
      name: 'status',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { titles: 'title', slug: 'slug.current', status: 'status' },
    prepare({ titles, slug, status }) {
      const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
      return {
        title,
        subtitle: `/${slug} ${status ? '✓ Active' : '✗ Inactive'}`,
      }
    },
  },
  orderings: [{ title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
})
