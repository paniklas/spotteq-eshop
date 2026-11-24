import { defineArrayMember, defineField, defineType } from 'sanity'

// Ambassador page singleton (fixed id "ambassadorPage", Site Settings →
// Ambassador Page): hero card, journey text with achievements, story text with
// the SPOTTEQ quote, and a short interview shown as an accordion. Every text is
// el/en side by side.
export const ambassadorPageType = defineType({
  name: 'ambassadorPage',
  title: 'Ambassador Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero card' },
    { name: 'journey', title: 'Journey' },
    { name: 'story', title: 'Story & quote' },
    { name: 'interview', title: 'Interview' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Ambassador Page',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Page Label',
      description: 'Small heading above the hero card, e.g. "Our Ambassador".',
      type: 'internationalizedArrayString',
    }),

    // Hero card
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description: 'Wide photo behind the hero text. The text sits on the left, so keep the athlete right of centre.',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      type: 'internationalizedArrayString',
      fieldset: 'hero',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      fieldset: 'hero',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Under the name. Line breaks are kept as written.',
      type: 'internationalizedArrayText',
      fieldset: 'hero',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Near the bottom of the card, above the arrow. Line breaks are kept as written.',
      type: 'internationalizedArrayText',
      fieldset: 'hero',
    }),

    // Journey
    defineField({
      name: 'journeyHeading',
      title: 'Journey Heading',
      type: 'internationalizedArrayString',
      fieldset: 'journey',
    }),
    defineField({
      name: 'journeyBody',
      title: 'Journey Text',
      type: 'internationalizedArrayBlockContent',
      fieldset: 'journey',
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      description: 'Bullet list of titles and records.',
      type: 'internationalizedArrayBlockContent',
      fieldset: 'journey',
    }),
    defineField({
      name: 'medalImage',
      title: 'Medal Image',
      description: 'Shown on the right, half over the gray and half over the white section.',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'journey',
    }),
    defineField({
      name: 'medalImageAlt',
      title: 'Medal Image Alt Text',
      type: 'internationalizedArrayString',
      fieldset: 'journey',
    }),

    // Story & quote
    defineField({
      name: 'storyBody',
      title: 'Story Text',
      type: 'internationalizedArrayBlockContent',
      fieldset: 'story',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      description: 'The large SPOTTEQ statement.',
      type: 'internationalizedArrayText',
      fieldset: 'story',
    }),

    // Interview
    defineField({
      name: 'interviewImage',
      title: 'Interview Image',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'interview',
    }),
    defineField({
      name: 'interviewImageAlt',
      title: 'Interview Image Alt Text',
      type: 'internationalizedArrayString',
      fieldset: 'interview',
    }),
    defineField({
      name: 'interviewHeading',
      title: 'Interview Heading',
      type: 'internationalizedArrayString',
      fieldset: 'interview',
    }),
    defineField({
      name: 'interviewIntro',
      title: 'Interview Intro',
      type: 'internationalizedArrayString',
      fieldset: 'interview',
    }),
    defineField({
      name: 'interviewItems',
      title: 'Questions',
      type: 'array',
      fieldset: 'interview',
      of: [
        defineArrayMember({
          name: 'interviewItem',
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
