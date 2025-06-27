// ボタンUI（ログインなど）
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return <button ref={ref} className={cn("bg-blue-500 text-white px-4 py-2 rounded", className)} {...props} />
})
Button.displayName = "Button"

export { Button }
