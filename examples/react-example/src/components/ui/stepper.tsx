import * as React from "react"
import { Check, Circle } from "lucide-react"
import { cn } from "@humanwallet/ui"

export interface StepItem {
  readonly key: string
  readonly icon?: React.ReactNode
  readonly title: string
  readonly description?: string
  readonly content?: React.ReactNode
  readonly optional?: boolean
}

export type StepStatus = "pending" | "current" | "completed" | "error"

interface StepperProps {
  readonly steps: StepItem[]
  readonly currentStep: string
  readonly orientation?: "horizontal" | "vertical"
  readonly className?: string
  readonly onStepClick?: (stepKey: string) => void
}

const getStepStatus = (stepKey: string, currentStep: string, steps: StepItem[]): StepStatus => {
  const currentIndex = steps.findIndex((step) => step.key === currentStep)
  const stepIndex = steps.findIndex((step) => step.key === stepKey)

  if (stepIndex < currentIndex) return "completed"
  if (stepIndex === currentIndex) return "current"
  return "pending"
}

const StepIndicator = ({
  status,
  icon,
  index,
}: {
  readonly status: StepStatus
  readonly icon?: React.ReactNode
  readonly index: number
}) => {
  if (status === "completed") {
    return (
      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-4" />
      </div>
    )
  }

  if (status === "current") {
    return (
      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {icon || <Circle className="size-4 fill-current" />}
      </div>
    )
  }

  return (
    <div className="flex size-8 items-center justify-center rounded-full border-2 border-muted-foreground/25 bg-background text-muted-foreground">
      {icon || <span className="text-sm font-medium">{index + 1}</span>}
    </div>
  )
}

const StepConnector = ({
  isCompleted,
  orientation,
}: {
  readonly isCompleted: boolean
  readonly orientation: "horizontal" | "vertical"
}) => {
  if (orientation === "vertical") {
    return (
      <div className="ml-4 flex w-px flex-col">
        <div className={cn("h-6 w-px", isCompleted ? "bg-primary" : "bg-muted-foreground/25")} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center">
      <div className={cn("h-px flex-1", isCompleted ? "bg-primary" : "bg-muted-foreground/25")} />
    </div>
  )
}

export const Stepper = ({ steps, currentStep, orientation = "vertical", className, onStepClick }: StepperProps) => {
  const currentStepData = steps.find((step) => step.key === currentStep)

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex", orientation === "horizontal" ? "items-center space-x-4" : "flex-col space-y-4")}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.key, currentStep, steps)
          const isLast = index === steps.length - 1
          const isClickable = onStepClick && (status === "completed" || status === "current")

          return (
            <div
              key={step.key}
              className={cn("flex", orientation === "horizontal" ? "flex-col items-center" : "flex-row items-start")}
            >
              <div
                className={cn(
                  "flex items-center",
                  orientation === "horizontal" ? "flex-col space-y-2" : "flex-row space-x-3",
                )}
              >
                <button
                  type="button"
                  onClick={isClickable ? () => onStepClick(step.key) : undefined}
                  disabled={!isClickable}
                  className={cn(
                    "transition-colors",
                    isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default",
                  )}
                >
                  <StepIndicator status={status} icon={step.icon} index={index} />
                </button>

                <div className={cn("space-y-1", orientation === "horizontal" ? "text-center" : "text-left")}>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      status === "current"
                        ? "text-foreground"
                        : status === "completed"
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                    {step.optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
                  </div>
                  {step.description && <div className="text-xs text-muted-foreground">{step.description}</div>}
                </div>
              </div>

              {!isLast && orientation === "horizontal" && (
                <StepConnector isCompleted={status === "completed"} orientation={orientation} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      {currentStepData?.content && <div className="mt-6 rounded-lg border bg-card p-6">{currentStepData.content}</div>}
    </div>
  )
}
