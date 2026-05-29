"use server"

import { defineQuery } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { backendClient } from '@/sanity/lib/backendClient'

const COUPON_QUERY = defineQuery(`
    *[_type == "sale"
        && upper(couponCode) == upper($couponCode)
        && isActive == true
    ][0] {
        _id,
        title,
        discountAmount,
        couponCode,
        validFrom,
        validUntil,
        maxUses,
        usedCount,
    }
`)

const COUPON_WITH_EMAIL_QUERY = defineQuery(`
    *[_type == "sale"
        && upper(couponCode) == upper($couponCode)
        && isActive == true
    ][0] {
        _id,
        title,
        discountAmount,
        couponCode,
        validFrom,
        validUntil,
        maxUses,
        usedCount,
        "emailUsed": defined(usageLog[lower(email) == lower($email)][0])
    }
`)

function checkValidity(coupon) {
    const now = new Date()
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return { valid: false, error: "Coupon is not yet valid." }
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        return { valid: false, error: "This coupon has expired." }
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
        return { valid: false, error: "This coupon has reached its usage limit." }
    }
    return { valid: true }
}

export async function validateCoupon(couponCode) {
    if (!couponCode?.trim()) {
        return { valid: false, error: "Please enter a coupon code." }
    }
    try {
        const result = await sanityFetch({ query: COUPON_QUERY, params: { couponCode: couponCode.trim() } })
        const coupon = result.data
        if (!coupon) return { valid: false, error: "Invalid coupon code." }

        const validity = checkValidity(coupon)
        if (!validity.valid) return validity

        return {
            valid: true,
            coupon: {
                _id: coupon._id,
                title: coupon.title,
                discountAmount: coupon.discountAmount,
                couponCode: coupon.couponCode,
            },
        }
    } catch {
        return { valid: false, error: "Unable to validate coupon. Please try again." }
    }
}

export async function validateCouponWithEmail(couponCode, email) {
    if (!couponCode?.trim()) {
        return { valid: false, error: "Please enter a coupon code." }
    }
    if (!email?.trim()) {
        return { valid: false, error: "Please enter your email address first." }
    }
    try {
        const result = await sanityFetch({
            query: COUPON_WITH_EMAIL_QUERY,
            params: { couponCode: couponCode.trim(), email: email.trim() },
        })
        const coupon = result.data
        if (!coupon) return { valid: false, error: "Invalid coupon code." }

        const validity = checkValidity(coupon)
        if (!validity.valid) return validity

        if (coupon.emailUsed) {
            return { valid: false, error: "This coupon has already been used with this email address." }
        }

        return {
            valid: true,
            coupon: {
                _id: coupon._id,
                title: coupon.title,
                discountAmount: coupon.discountAmount,
                couponCode: coupon.couponCode,
            },
        }
    } catch {
        return { valid: false, error: "Unable to validate coupon. Please try again." }
    }
}

export async function recordCouponUsage(couponId, email, orderId) {
    try {
        const doc = await backendClient.getDocument(couponId)
        if (!doc) return

        await backendClient
            .patch(couponId)
            .setIfMissing({ usageLog: [], usedCount: 0 })
            .append('usageLog', [{
                _key: `${email}-${Date.now()}`,
                email,
                usedAt: new Date().toISOString(),
                orderId: orderId ?? '',
            }])
            .inc({ usedCount: 1 })
            .commit()

        // Auto-deactivate if maxUses reached
        if (doc.maxUses != null && (doc.usedCount ?? 0) + 1 >= doc.maxUses) {
            await backendClient.patch(couponId).set({ isActive: false }).commit()
        }
    } catch (error) {
        console.error('Failed to record coupon usage:', error)
    }
}
