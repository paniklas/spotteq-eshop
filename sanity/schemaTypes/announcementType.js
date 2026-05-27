import { defineField, defineType } from 'sanity'

export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Announcement Bar',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Announcement Text',
      type: 'internationalizedArrayString',
      description: 'Text displayed in the top announcement bar',
    }),
    defineField({
      name: 'link',
      title: 'CTA Link',
      type: 'url',
      description: 'Optional — makes the bar clickable',
    }),
    defineField({
      name: 'linkText',
      title: 'CTA Link Text',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', isActive: 'isActive' },
    prepare({ title, isActive }) {
      return { title, subtitle: isActive ? '✓ Active' : '✗ Inactive' }
    },
  },
})
