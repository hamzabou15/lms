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
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";




interface CategoryFormProps {

    initialData: Course;
    courseId: string;
    options: { label: string; value: string; }[]


};

// 0 - definition of schema validation ith ZOD
const formSchema = z.object({
    categoryId: z.string().min(1)
})

// component
const CategoryForm = ({
    initialData, courseId, options
}: CategoryFormProps) => {

    const [isEdeting, setIsEdeting] = useState(false);

    // 2 - definition of type of form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;


    const router = useRouter();


    // 3 - handle of submition of Form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course description Updated');
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


    const selectedOption = options.find((option) => option.value === initialData.categoryId)

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button variant={"ghost"} onClick={toggleEdit} className="cursor-pointer" >
                    {isEdeting ? (
                        <span>Cancel</span>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 ml-2 mr-2" />

                            <>Edit Category</>
                        </>
                    )}
                </Button>
            </div>
            {!isEdeting && (
                <p className={cn("text-sm mt-2 ", !initialData.categoryId ? "text-slate-500 italic" : "")}>
                    {selectedOption?.label || "No Category"}
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options} // Vérifie que "options" est bien défini
                                            value={field.value} // Associe la valeur sélectionnée
                                            onChange={(value) => {
                                                console.log("Selected value:", value);
                                                field.onChange(value); // Met à jour la valeur dans le formulaire
                                            }}
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

export default CategoryForm
