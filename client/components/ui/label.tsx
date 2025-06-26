// フォームのラベル表示（「メールアドレス」など）
import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ ...props }, ref) => {
  return <label ref={ref} {...props} />
})
Label.displayName = "Label"
