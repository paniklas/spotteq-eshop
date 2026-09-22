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
      name: 'phone',
      title: 'Phone',
      type: 'string',
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
      name: 'firstOrderDiscountUsed',
      title: 'First Order Discount Already Used',
      type: 'boolean',
      description: 'OFF = the customer still has their first-order discount, and it is applied automatically at their next checkout. This is the correct state for every new customer — nothing needs switching on. It turns ON by itself once a paid order has used the discount. Switch it back OFF only to deliberately give a customer that discount a second time.',
      initialValue: false,
    }),
    defineField({
      name: 'firstOrderDiscountUsedAt',
      title: 'First Order Discount Used At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'firstOrderDiscountClaim',
      title: 'First Order Discount Claim',
      description: 'Short-lived hold taken while a checkout that uses the discount is in progress, so the same discount cannot be spent by two checkouts at once. It clears itself when the payment succeeds or fails, and expires on its own if the customer walks away. Nothing here needs managing by hand.',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'id', title: 'Claim ID', type: 'string' }),
        defineField({ name: 'at', title: 'Claimed At', type: 'datetime' }),
        defineField({
          name: 'intentId',
          title: 'Stripe Payment Intent',
          description: 'The intent this hold authorised. An expired hold is only taken over after this intent has been cancelled, so an abandoned tab cannot spend the discount a second time.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'favourites',
      title: 'Favourites',
      type: 'array',
      description: 'Products and bundles the customer has saved to their wishlist.',
      of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'bundle' }] }],
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
