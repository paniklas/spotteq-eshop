import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'stripeCheckoutSessionId',
      title: 'Stripe Checkout Session ID',
      type: 'string',
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isGuestCheckout',
      title: 'Guest Checkout',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
            defineField({ name: 'quantity', type: 'number', validation: Rule => Rule.required().min(1).integer() }),
            defineField({ name: 'price', type: 'number', validation: Rule => Rule.required() }),
            defineField({ name: 'selectedFlavour', type: 'string' }),
          ],
          preview: {
            select: { titles: 'product.title', qty: 'quantity', price: 'price' },
            prepare({ titles, qty, price }) {
              const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
              return { title, subtitle: `Qty: ${qty} × €${price}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'bundles',
      title: 'Bundles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'bundle', type: 'reference', to: [{ type: 'bundle' }] }),
            defineField({ name: 'quantity', type: 'number', validation: Rule => Rule.required().min(1).integer() }),
            defineField({ name: 'price', type: 'number', validation: Rule => Rule.required() }),
          ],
          preview: {
            select: { titles: 'bundle.title', qty: 'quantity', price: 'price' },
            prepare({ titles, qty, price }) {
              const title = Array.isArray(titles) ? titles.find(t => t._key === 'el')?.value || titles[0]?.value : ''
              return { title: `[Bundle] ${title}`, subtitle: `Qty: ${qty} × €${price}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price (€)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'eur',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'amountDiscount',
      title: 'Discount Amount (€)',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'appliedCoupon',
      title: 'Applied Coupon',
      type: 'object',
      fields: [
        defineField({ name: 'code', type: 'string' }),
        defineField({ name: 'sale', type: 'reference', to: [{ type: 'sale' }] }),
      ],
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Shipping Method',
      type: 'reference',
      to: [{ type: 'shipping' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({ name: 'firstName', type: 'string' }),
        defineField({ name: 'lastName', type: 'string' }),
        defineField({ name: 'address', type: 'string' }),
        defineField({ name: 'apartment', type: 'string' }),
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'postalCode', type: 'string' }),
        defineField({ name: 'country', type: 'string' }),
        defineField({ name: 'phone', type: 'string' }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Refunded', value: 'refunded' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'userInfo',
      title: 'Customer Profile',
      type: 'reference',
      to: [{ type: 'userInfo' }],
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      email: 'email',
      totalPrice: 'totalPrice',
      status: 'status',
    },
    prepare({ orderNumber, customerName, email, totalPrice, status }) {
      return {
        title: `#${orderNumber} — ${customerName || email}`,
        subtitle: `€${totalPrice} | ${status}`,
      }
    },
  },
  orderings: [{ title: 'Order Date (Newest First)', name: 'orderDateDesc', by: [{ field: 'orderDate', direction: 'desc' }] }],
})
