import { defineField, defineType } from 'sanity'

const addressFields = [
  defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
  defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
  defineField({ name: 'company', title: 'Company', type: 'string' }),
  defineField({ name: 'address', title: 'Address', type: 'string' }),
  defineField({ name: 'apartment', title: 'Apartment / Suite', type: 'string' }),
  defineField({ name: 'city', title: 'City', type: 'string' }),
  defineField({ name: 'postalCode', title: 'Postal Code', type: 'string' }),
  defineField({ name: 'country', title: 'Country', type: 'string' }),
  defineField({ name: 'phone', title: 'Phone', type: 'string' }),
]

export const userInfoType = defineType({
  name: 'userInfo',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'ID from the auth provider (Clerk, NextAuth, etc.)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
        ],
        layout: 'radio',
      },
      initialValue: 'customer',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Default Shipping Address',
      type: 'object',
      fields: addressFields,
    }),
    defineField({
      name: 'billingInfo',
      title: 'Default Billing Address',
      type: 'object',
      fields: addressFields,
    }),
    defineField({
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        defineField({ name: 'emailMarketing', title: 'Email Marketing', type: 'boolean', initialValue: false }),
        defineField({ name: 'saveInfo', title: 'Save Info for Next Time', type: 'boolean', initialValue: false }),
        defineField({ name: 'subscribedAt', title: 'Subscribed At', type: 'datetime' }),
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { email: 'email', userId: 'userId', role: 'role' },
    prepare({ email, userId, role }) {
      return {
        title: email,
        subtitle: `[${role || 'customer'}] ${userId || ''}`,
      }
    },
  },
})
