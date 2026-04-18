"use server"

import { z } from "zod"
// import { client } from "@/sanity/lib/client";


// Define the validation schema for the newsletter form
const firstOrderSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email({ message: "Please enter a valid email address" }),
})


export async function firstOrder(formData, locale) {

    const fullName = formData.get('fullName')
    const email = formData.get('email')

    const result = firstOrderSchema.safeParse({ fullName, email });
    
    if (!result.success) {
        return { 
            success: false, 
            errors: result.error.flatten().fieldErrors 
        }
    }
    
    try {

        // // Check if email already exists
        // const existingSubscriber = await client.fetch(
        //     `*[_type == "newsletter" && email == $email][0]`,
        //     { email: result.data.email }
        // );

        // if (existingSubscriber) {
        //     return {
        //         success: false,
        //         error: true,
        //         message: 'ALREADY_SUBSCRIBED'
        //     };
        // }

        // // Save to Sanity
        // const sanityResult = await client.create({
        //     _type: 'newsletter',
        //     fullName: result.data.fullName,
        //     email: result.data.email,
        //     createdAt: new Date().toISOString(),
        // });

        return {
            success: true,
            error: false
        };

    } catch (error) {
        console.error("Error submitting newsletter form:", error);
        return {
            success: false,
            error: true
        };
    }
}
