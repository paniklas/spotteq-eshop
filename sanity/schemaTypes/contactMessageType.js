import { defineField, defineType } from 'sanity'

// One document per contact-form message, written by app/api/contact.
//
// The _id is `contactMessage.<uuid>`. The dot matters: the dataset is public,
// and Sanity only serves documents at the root path to anonymous readers, so a
// dotted id keeps senders' names, emails and messages out of public queries
// (same reasoning as newsletterSubscriberType).
export const contactMessageType = defineType({
  name: 'contactMessage',
  title: 'Contact Message',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'orderNumber', title: 'Order Number', type: 'string' }),
    defineField({ name: 'subject', title: 'Subject', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 10 }),
    defineField({
      name: 'locale',
      title: 'Language',
      description: 'Site language the message was sent from — the language to reply in.',
      type: 'string',
    }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
  ],
  preview: {
    select: { subject: 'subject', fullName: 'fullName', email: 'email', submittedAt: 'submittedAt' },
    prepare({ subject, fullName, email, submittedAt }) {
      return {
        title: subject || '(no subject)',
        subtitle: [fullName, email, submittedAt ? new Date(submittedAt).toLocaleString() : ''].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [{ title: 'Newest First', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }],
})
