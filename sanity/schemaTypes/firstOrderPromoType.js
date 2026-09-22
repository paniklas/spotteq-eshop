import { defineField, defineType } from 'sanity'

export const firstOrderPromoType = defineType({
  name: 'firstOrderPromo',
  title: 'First Order Discount',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'First Order Discount',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'When off, registered customers are charged full price on their first order.',
      initialValue: true,
    }),
    defineField({
      name: 'discountPercent',
      title: 'Discount (%)',
      type: 'number',
      description: 'Percentage off the subtotal of a registered customer\'s first order. Applied automatically at checkout — the customer types no code. A coupon code replaces it rather than stacking with it.',
      initialValue: 10,
      validation: Rule => Rule.required().min(1).max(100),
    }),
  ],
  preview: {
    select: { discountPercent: 'discountPercent', isActive: 'isActive' },
    prepare({ discountPercent, isActive }) {
      return {
        title: 'First Order Discount',
        subtitle: `${discountPercent ?? 0}% — ${isActive ? '✓ Active' : '✗ Inactive'}`,
      }
    },
  },
})
