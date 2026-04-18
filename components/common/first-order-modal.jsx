"use client"

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as z from "zod";
import { firstOrder } from "@/actions/firstOrder";

const FirstOrderModal = ({ isOpen, onClose }) => {
    // if (!isOpen) return null;

    const firstOrderSchema = z.object({
        fullName: z.string().min(3, { message: "Full Name Required" }),
        email: z.email({ message: "Email is not Valid" })
    })

    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(firstOrderSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    })

    // Handle form submission
    const  onSubmit = () => {

        const values = form.getValues();

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("fullName", values.fullName);
                formData.append("email", values.email);
                
                const result = await firstOrder(formData, locale);

                if (result?.success) {
                    toast.success(t("Form submitted successfully!"));
                    form.reset();
                    onClose();
                } else {
                    console.error("Server returned error:", result);
                    // Handle specific error cases
                    if (result?.message === 'ALREADY_SUBSCRIBED') {
                        toast.error(t("Already subscribed"));
                    } else if (result?.errors) {
                        // Display specific validation errors if available
                        const errorMessage = Object.entries(result.errors)
                            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                            .join('\n');
                        toast.error(errorMessage);
                    } else {
                        toast.error("Error Submitting Form");
                    }
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Error Submitting Form");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { form.reset(); onClose(); } }}>
            <DialogContent showCloseButton={false} className="sm:max-w-[500px] xl:max-w-[700px] bg-white-custom text-black-custom border-none p-12 font-aeonik rounded-[20px]">
                <DialogHeader className="pt-2">
                    <div>
                        <DialogTitle className="text-[20px] xl:text-[40px] font-normal text-center">10% Off Your First Order</DialogTitle>
                        <DialogDescription className="text-center mt-1 text-[16px] xl:text-[24px] text-black-custom">
                            Be the first to know about discounts and news
                        </DialogDescription>
                    </div>
                    <button
                        onClick={() => { form.reset(); onClose(); }}
                        className="absolute right-8 top-4 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer outline-none"
                    >
                        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="-0.5" x2="30" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 21.9204 0.707092)" stroke="black"/>
                            <line y1="-0.5" x2="30" y2="-0.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 0.707275 0.707092)" stroke="black"/>
                        </svg>
                        <span className="sr-only">Close</span>
                    </button>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        placeholder="Your full name"
                                        {...field}
                                        className="border-black-custom/20 py-4 px-3 rounded-[20px] text-black-custom placeholder:text-black-custom"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Your email"
                                            type="email"
                                            {...field}
                                            className="border-black-custom/20 py-4 px-3 rounded-[20px] text-black-custom placeholder:text-black-custom"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black-custom text-white-custom font-medium py-4 px-3 rounded-[20px] cursor-pointer"
                        >
                            {isPending ? "Submitting..." : "Subscribe"}
                        </Button>

                        <span className="text-black-custom mt-3">By subscribing you agree to receive email marketing communications from SPOTTEQ.</span>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default FirstOrderModal