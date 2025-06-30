"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthForm } from "./auth-form"
import Image from "next/image"
import { cn } from "@/lib/utils"

type UserType = "parent" | "teacher"

function AuthCard() {
const [userType, setUserType] = useState<UserType>("parent")

return (
<Card className="w-full max-w-md rounded-[30px] shadow-2xl shadow-gray-300/50 p-10 bg-white/80 backdrop-blur-sm">
    <div className="flex justify-center mb-8">
    {/* Placeholder for logo or cute illustration */}
    <Image
        src="/placeholder.svg?height=100&width=100"
        alt="App Logo"
        width={100}
        height={100}
        className="rounded-full"
    />
    </div>

    <Tabs defaultValue="parent" className="w-full" onValueChange={(value) => setUserType(value as UserType)}>
    <TabsList
        className={cn(
        "grid w-full grid-cols-2 h-auto p-1 rounded-full transition-colors duration-200",
        userType === "parent" ? "bg-pink-accent/40" : "bg-blue-accent/40"
        )}
    >
        <TabsTrigger
        value="parent"
        className={cn(
            "rounded-full py-2 text-lg font-semibold transition-colors duration-200",
            userType === "parent" ? "bg-pink-accent text-white shadow-sm" : "text-font-primary"
        )}
        >
        保護者
        </TabsTrigger>
        <TabsTrigger
        value="teacher"
        className={cn(
            "rounded-full py-2 text-lg font-semibold transition-colors duration-200",
            userType === "teacher" ? "bg-blue-accent text-white shadow-sm" : "text-font-primary"
        )}
        >
        保育園
        </TabsTrigger>
    </TabsList>
    <TabsContent value="parent" className="mt-8">
        <AuthForm userType="parent" />
    </TabsContent>
    <TabsContent value="teacher" className="mt-8">
        <AuthForm userType="teacher" />
    </TabsContent>
    </Tabs>
</Card>
)
}

export default function LoginPage() {
return (
<div className="min-h-screen flex items-center justify-center bg-background">
    <AuthCard />
</div>
)
}