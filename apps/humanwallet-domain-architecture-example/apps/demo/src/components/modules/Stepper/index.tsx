import { ReactNode } from "react"
import { classNames } from "../../../js/css"
import styles from "./index.module.css"
import { CheckOutlinedIcon } from "@tutellus/tutellus-components"

export interface StepItem {
  key: string
  icon: ReactNode
  header: ReactNode
  content: ReactNode
}

interface StepperProps {
  currentStep: string
  steps: StepItem[]
}

export const Stepper = ({ currentStep, steps }: StepperProps) => {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div key={step.key} className={classNames(styles.step, currentStep === step.key ? styles.current : "")}>
          <div className={styles.lineContainer}>
            <div className={styles.iconContainer}>
              <div className={styles.icon}>{currentStepIndex > index ? <CheckOutlinedIcon /> : step.icon}</div>
            </div>
            <div className={styles.line} />
          </div>
          <div className={styles.stepContainer}>
            <div className={styles.header}>{step.header}</div>
            {step.key === currentStep && <div className={styles.content}>{step.content}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
