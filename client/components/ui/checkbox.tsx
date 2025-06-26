// 利用規約などのチェック欄
import * as React from "react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ ...props }, ref) => {
  return <input type="checkbox" ref={ref} {...props} />
})
Checkbox.displayName = "Checkbox"
