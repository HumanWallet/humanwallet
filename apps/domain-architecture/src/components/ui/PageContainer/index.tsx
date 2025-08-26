import type { ReactNode } from "react"
import { Heading } from "@tutellus/tutellus-components"
import styles from "./index.module.css"

interface PageContainerProps {
  readonly title?: string
  readonly subtitle?: string
  readonly children: ReactNode
  readonly align?: "left" | "center" | "right"
}

export const PageContainer = ({ title, subtitle, children, align = "center" }: PageContainerProps) => {
  return (
    <div className={styles.container}>
      {title && (
        <Heading as="h1" align={align}>
          {title}
        </Heading>
      )}
      {subtitle && (
        <Heading as="h2" align={align}>
          {subtitle}
        </Heading>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
