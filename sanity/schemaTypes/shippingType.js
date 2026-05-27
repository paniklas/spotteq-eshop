import { defineArrayMember, defineField, defineType } from 'sanity'

const AVAILABLE_REGIONS = [
  { title: 'Greece', value: 'GR' },
  { title: 'United States', value: 'US' },
  { title: 'Germany', value: 'DE' },
  { title: 'France', value: 'FR' },
  { title: 'Italy', value: 'IT' },
  { title: 'Spain', value: 'ES' },
  { title: 'United Kingdom', value: 'GB' },
  { title: 'Canada', value: 'CA' },
  { title: 'Australia', value: 'AU' },
  { title: 'Netherlands', value: 'NL' },
  { title: 'Belgium', value: 'BE' },
  { title: 'Austria', value: 'AT' },
  { title: 'Switzerland', value: 'CH' },
  { title: 'Sweden', value: 'SE' },
  { title: 'Norway', value: 'NO' },
  { title: 'Denmark', value: 'DK' },
  { title: 'Finland', value: 'FI' },
  { title: 'Poland', value: 'PL' },
  { title: 'Portugal', value: 'PT' },
  { title: 'Ireland', value: 'IE' },
  { title: 'Cyprus', value: 'CY' },
]

export const shippingType = defineType({
  name: 'shipping',
  title: 'Shipping Method',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'price',
      title: 'Price (€)',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'estimatedDeliveryTime',
      title: 'Estimated Delivery Time',
      type: 'internationalizedArrayString',
      description: 'e.g. "2-3 Business Days"',
    }),
    defineField({
      name: 'shippingType',
      title: 'Shipping Type',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Express', value: 'express' },
          { title: 'Next Day', value: 'nextDay' },
          { title: 'International', value: 'international' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'freeShippingMinimum',
      title: 'Free Shipping Minimum (€)',
      type: 'number',
      validation: Rule => Rule.min(0),
      description: 'Order total above this amount gets free shipping (0 = always free)',
    }),
    defineField({
      name: 'availableRegions',
      title: 'Available Regions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: AVAILABLE_REGIONS, layout: 'grid' },
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { names: 'name', price: 'price', isActive: 'isActive' },
    prepare({ names, price, isActive }) {
      const name = Array.isArray(names) ? names.find(n => n._key === 'el')?.value || names[0]?.value : ''
      return { title: name, subtitle: `€${price} ${isActive ? '✓' : '✗'}` }
    },
  },
})
