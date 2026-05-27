import { defineArrayMember, defineField, defineType } from 'sanity'

export const saleType = defineType({
  name: 'sale',
  title: 'Sale / Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name for this sale/coupon',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'discountAmount',
      title: 'Discount Amount',
      type: 'number',
      description: 'Percentage (%) or fixed (€) — clarify in the title',
    }),
    defineField({
      name: 'couponCode',
      title: 'Coupon Code',
      type: 'string',
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
      initialValue: () => {
        const d = new Date()
        d.setDate(d.getDate() + 7)
        return d.toISOString()
      },
    }),
    defineField({
      name: 'usedCount',
      title: 'Times Used',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'usageLog',
      title: 'Usage Log',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'email', type: 'string' }),
            defineField({ name: 'usedAt', type: 'datetime' }),
            defineField({ name: 'orderId', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', couponCode: 'couponCode', discountAmount: 'discountAmount', isActive: 'isActive' },
    prepare({ title, couponCode, discountAmount, isActive }) {
      return {
        title: title || couponCode || 'Unnamed Sale',
        subtitle: `${discountAmount ? discountAmount + ' off' : ''} ${couponCode ? '[' + couponCode + ']' : ''} ${isActive ? '✓' : '✗'}`,
      }
    },
  },
})
