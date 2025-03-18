"use client";
import {  UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
            <UserButton  signInUrl="/sign-in" />
    </div>
  );
}