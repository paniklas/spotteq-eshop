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
      // Array is editable so an admin can delete an entry (e.g. to let an email
      // use the coupon again). The entry fields stay readOnly so the recorded
      // values can't be tampered with — only the whole entry can be removed.
      description: 'Recorded redemptions. Delete an entry to let that email use the coupon again (see note: this does not change "Times Used" or reactivate a maxed-out coupon).',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'email', type: 'string', readOnly: true }),
            defineField({ name: 'usedAt', type: 'datetime', readOnly: true }),
            defineField({ name: 'orderId', type: 'string', readOnly: true }),
          ],
          preview: {
            select: { email: 'email', usedAt: 'usedAt' },
            prepare({ email, usedAt }) {
              return {
                title: email || '(no email)',
                subtitle: usedAt ? new Date(usedAt).toLocaleString() : '',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'maxUses',
      title: 'Max Uses',
      type: 'number',
      description: 'Leave empty for unlimited uses. Coupon auto-deactivates when this limit is reached.',
      validation: (Rule) => Rule.min(1).integer().optional(),
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
