"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";


// 0 - definition of schema validation ith ZOD
const formSchema = z.object({

    price: z.coerce.number()
})

interface PriceFormProps {

    initialData: {
        price: number;
    };
    courseId: string;

};

// component
const PriceForm = ({
    initialData, courseId
}: PriceFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);

    // 2 - definition of type of form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined, 
        },
    });

    const { isSubmitting, isValid } = form.formState;


    const router = useRouter();


    // 3 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course price Updated');
            toggleEdit();

            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong ');
        }
    }

    const toggleEdit = () => {
        setIsEdeting((current) => !current);
    };


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button variant={"ghost"} onClick={toggleEdit} className="cursor-pointer" >
                    {isEdeting ? (
                        <span>Cancel</span>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 ml-2 mr-2" />

                            <>Edit price</>
                        </>
                    )}
                </Button>
            </div>
            {!isEdeting && (
                <p className={cn("text-sm mt-2 ", !(initialData?.price) ? "text-slate-500 italic" : "")}>
                    {(initialData?.price ? formatPrice(initialData?.price) : "No price") }
                </p>
            )
            }
            {isEdeting && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting}
                                            type="number"
                                            step={0.01}
                                            className="bg-white"
                                            placeholder="Set a price for your course"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting || !isValid}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )

            }
        </div>
    )
}

export default PriceForm
