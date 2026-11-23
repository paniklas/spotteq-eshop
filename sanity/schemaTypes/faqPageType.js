import { defineArrayMember, defineField, defineType } from 'sanity'

// FAQ page singleton (fixed id "faqPage", Site Settings → FAQ Page). Sections
// of questions, each question and answer in el/en side by side, so both
// languages share one order. The closing line sits under the last section.
export const faqPageType = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'FAQ Page',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Page heading, e.g. "Frequently Asked Questions".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'faqSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'items',
              title: 'Questions',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'faqItem',
                  title: 'Question',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'question',
                      title: 'Question',
                      type: 'internationalizedArrayString',
                    }),
                    defineField({
                      name: 'answer',
                      title: 'Answer',
                      description: 'Use Bullet for lists.',
                      type: 'internationalizedArrayBlockContent',
                    }),
                  ],
                  preview: {
                    select: { question: 'question' },
                    prepare({ question }) {
                      const q = question?.find((v) => v.language === 'el') || question?.[0]
                      return { title: q?.value || 'Question' }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title', items: 'items' },
            prepare({ title, items }) {
              const t = title?.find((v) => v.language === 'el') || title?.[0]
              const count = items?.length || 0
              return { title: t?.value || 'Section', subtitle: `${count} question${count === 1 ? '' : 's'}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'closing',
      title: 'Closing Text',
      description: 'Shown under the last section, e.g. the contact email.',
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
          description: 'The preferred URL for this page (if different from the default)',
          type: 'url',
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
