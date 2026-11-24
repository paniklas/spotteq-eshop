import { defineField, defineType } from 'sanity'

// Text pages: Privacy Policy, Terms of Use, Cookies Policy, Shipping & Payments
// and Returns Policy. One type for all of them; each page is a singleton with a
// fixed document id ("privacyPage", "termsPage", "cookiesPage", "shippingPage",
// "returnsPage") set in sanity/structure.js.
export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Page heading, e.g. "Privacy Policy".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      description: 'Use H2 for the section headings (shown underlined), and Bullet or Numbered for lists.',
      type: 'internationalizedArrayBlockContent',
    }),

    // SEO Metadata Field
    defineField({
      name: 'metadata',
      title: 'SEO Metadata',
      type: 'object',
      validation: Rule => Rule.required(),
      fields: [

        // Meta Title Field
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'internationalizedArrayString',
          validation: (Rule) => Rule.required(),
        }),

        // Meta Description Field
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'internationalizedArrayText',
          validation: (Rule) => Rule.required(),
        }),

        // OG Image Field
        defineField({
          name: 'ogImage',
          title: 'Social Media Image',
          type: 'image',
          description: 'Image displayed when sharing on social media (1200 x 630px recommended)',
          options: {
              hotspot: true,
          }
        }),

        // Keywords Field
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'object',
          description: 'Keywords relevant to the page content',
          fields: [
            defineField({
              name: 'en',
              title: 'English Keywords',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags'
              }
            }),
            defineField({
              name: 'el',
              title: 'Greek Keywords',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags'
              }
            })
          ]
        }),

        // Canonical URL Field
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          description: 'Leave empty: each page already declares its own URL as canonical, per language. Fill in only to point a language version at a different page (full https://www.spotteq.com/… address).',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'el', title: 'Greek page', type: 'url' }),
            defineField({ name: 'en', title: 'English page', type: 'url' }),
          ],
        }),

        // No Index Field
        defineField({
          name: 'noIndex',
          title: 'No Index',
          description: 'Instruct search engines not to index this page',
          type: 'boolean',
          initialValue: false,
        }),
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
