// テキストなどの入力欄
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn("border p-2 rounded", className)} {...props} />
})
Input.displayName = "Input"

export { Input }
