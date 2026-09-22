import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'About Page',
      validation: Rule => Rule.required(),
    }),

    // Hero
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Main page heading. Line breaks are preserved as written.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description: 'Wide image below the heading. Recommended: 1140 x 523px',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      type: 'internationalizedArrayString',
    }),

    // "Spotter" section
    defineField({
      name: 'spotterLines',
      title: 'Spotter Section Intro Lines',
      description: 'The tightly spaced lines above the paragraphs. Use Strong for the bold lead-ins.',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'spotterBody',
      title: 'Spotter Section Paragraphs',
      description: 'Paragraphs below the intro lines. Use Strong for emphasis.',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'spotterImage',
      title: 'Spotter Section Image',
      description: 'Image on the right of the section. Recommended: 438 x 450px',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spotterImageAlt',
      title: 'Spotter Section Image Alt Text',
      type: 'internationalizedArrayString',
    }),

    // Mission section
    defineField({
      name: 'missionHeading',
      title: 'Mission Heading',
      description: 'Section heading. Line breaks are preserved as written.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission Section Text',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'missionImage',
      title: 'Mission Section Image',
      description: 'Image on the right of the section. Recommended: 575 x 600px',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'missionImageAlt',
      title: 'Mission Section Image Alt Text',
      type: 'internationalizedArrayString',
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
