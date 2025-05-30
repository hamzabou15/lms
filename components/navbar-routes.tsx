"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";

const NavbarRoutes = () => {

    // logic for handle case of Teacher mode
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes('/courses'); // individual course page

    const isSearchPage = pathname === "/search"

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput
                    />
                </div>
            )

            }
            <div className="flex gap-x-2 ml-auto">
                {
                    isTeacherPage || isCoursePage ? (
                        <Link href="/">
                            <Button>
                                <LogOut className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>

                    ) : (
                        <Link href="/teacher/courses">
                            <Button size="sm" variant="ghost">
                                Teacher mode
                            </Button>
                        </Link>
                    )
                }
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
    )
}

export default NavbarRoutes
