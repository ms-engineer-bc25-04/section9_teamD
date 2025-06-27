// 	枠（カード）を作るコンポーネント
import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, ...props }: CardProps) => {
  return <div className={cn("rounded-lg bg-white p-6 shadow", className)} {...props} />
}
