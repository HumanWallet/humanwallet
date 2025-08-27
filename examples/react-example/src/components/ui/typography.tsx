import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-center font-serif text-4xl font-extrabold tracking-wider text-balance",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6 font-normal sm:text-base",
      large: "text-lg font-semibold",
      lead: "text-muted-foreground text-xl",
      small: "text-sm leading-none font-medium",
      muted: "text-muted-foreground text-sm",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      "inline-code": "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-normal",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

interface TypographyProps extends React.PropsWithChildren, VariantProps<typeof typographyVariants> {
  className?: string
  children: ReactNode
}

export function Typography({ variant, className, children }: TypographyProps) {
  const styles = typographyVariants({ variant })

  switch (variant) {
    case "h1":
      return <h1 className={cn(styles, className)}>{children}</h1>
    case "h2":
      return <h2 className={cn(styles, className)}>{children}</h2>
    case "h3":
      return <h3 className={cn(styles, className)}>{children}</h3>
    case "h4":
      return <h4 className={cn(styles, className)}>{children}</h4>
    case "large":
      return <div className={cn(styles, className)}>{children}</div>
    case "lead":
      return <p className={cn(styles, className)}>{children}</p>
    case "small":
      return <small className={cn(styles, className)}>{children}</small>
    case "muted":
      return <p className={cn(styles, className)}>{children}</p>
    case "blockquote":
      return <blockquote className={cn(styles, className)}>{children}</blockquote>
    case "inline-code":
      return <code className={cn(styles, className)}>{children}</code>
    default:
      return <p className={cn(styles, className)}>{children}</p>
  }
}
