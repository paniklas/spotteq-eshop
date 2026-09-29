import { defineField, defineType } from 'sanity'

// One document per newsletter subscriber, written by lib/newsletter.js — from
// the footer signup and from the checkout opt-in once the order is paid.
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
    defineField({
      name: 'source',
      title: 'Source',
      description: 'Where consent was given: the footer signup form, or the marketing checkbox at checkout.',
      type: 'string',
      options: {
        list: [
          { title: 'Footer signup', value: 'footer' },
          { title: 'Checkout opt-in', value: 'checkout' },
        ],
      },
    }),
    defineField({ name: 'subscribedAt', title: 'Subscribed At', type: 'datetime' }),
  ],
  preview: {
    select: { email: 'email', locale: 'locale', source: 'source', subscribedAt: 'subscribedAt' },
    prepare({ email, locale, source, subscribedAt }) {
      return {
        title: email || '(no email)',
        subtitle: [locale?.toUpperCase(), source, subscribedAt ? new Date(subscribedAt).toLocaleString() : ''].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [{ title: 'Newest First', name: 'subscribedAtDesc', by: [{ field: 'subscribedAt', direction: 'desc' }] }],
})
