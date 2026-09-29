import { defineField, defineType } from 'sanity'

// One document per newsletter subscriber, written by the footer signup
// (app/api/newsletter/route.js).
//
// The _id is `newsletterSubscriber.<sha256 of the email>`. The dot matters: the
// dataset is public, and Sanity only serves documents at the root path to
// anonymous readers, so a dotted id keeps subscriber emails out of public
// queries. The hash (not the email itself) keeps personal data out of the id,
// which Sanity retains even after deletion, and makes creating the document the
// duplicate check — the same email always lands on the same id.
export const newsletterSubscriberType = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'locale',
      title: 'Language',
      description: 'Site language at signup — the language to write to this subscriber in.',
      type: 'string',
    }),
    defineField({ name: 'subscribedAt', title: 'Subscribed At', type: 'datetime' }),
  ],
  preview: {
    select: { email: 'email', locale: 'locale', subscribedAt: 'subscribedAt' },
    prepare({ email, locale, subscribedAt }) {
      return {
        title: email || '(no email)',
        subtitle: [locale?.toUpperCase(), subscribedAt ? new Date(subscribedAt).toLocaleString() : ''].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [{ title: 'Newest First', name: 'subscribedAtDesc', by: [{ field: 'subscribedAt', direction: 'desc' }] }],
})
