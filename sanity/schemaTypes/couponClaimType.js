import { defineField, defineType } from 'sanity'

// Short-lived hold taken while a checkout that uses a coupon is in progress.
//
// One document per coupon + email, with a deterministic _id, so creating it is
// itself the lock: the second checkout simply cannot create a document that
// already exists. A hold on a shared "sale" document would have made every
// customer's checkout contend with every other's; this way two different
// customers never touch the same document.
//
// Machine-managed and deliberately absent from the Studio structure — these are
// transient. The permanent record of who redeemed a coupon is the Usage Log on
// the coupon itself.
export const couponClaimType = defineType({
  name: 'couponClaim',
  title: 'Coupon Claim',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'sale', title: 'Coupon', type: 'reference', to: [{ type: 'sale' }] }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'claimId',
      title: 'Claim ID',
      description: 'Identifies the checkout attempt holding this. Travels in the browser\'s pending-checkout cookie so the same browser can renew its own hold instead of being blocked by it.',
      type: 'string',
    }),
    defineField({ name: 'at', title: 'Claimed At', type: 'datetime' }),
    defineField({
      name: 'intentId',
      title: 'Stripe Payment Intent',
      description: 'The intent this hold authorised. An expired hold is only taken over after this intent has been cancelled.',
      type: 'string',
    }),
  ],
  preview: {
    select: { email: 'email', at: 'at' },
    prepare({ email, at }) {
      return { title: email || '(no email)', subtitle: at ? new Date(at).toLocaleString() : '' }
    },
  },
})
