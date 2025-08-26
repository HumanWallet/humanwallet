import { useTranslation } from "react-i18next"
import { StakingSteps, StakingBundle } from "../../components/modules/Staking"
import { TabContainer, PageContainer } from "../../components/ui"
import { useAccount } from "wagmi"
import { Navigate } from "react-router"

enum DemoTabs {
  Steps = "steps",
  Bundle = "bundle",
}

export function Component() {
  const { isDisconnected } = useAccount()

  if (isDisconnected) {
    return <Navigate to="/connect" />
  }

  const { t } = useTranslation("demo")

  const tabs = [
    {
      id: DemoTabs.Steps,
      label: "tabs.steps",
      content: <StakingSteps />,
    },
    {
      id: DemoTabs.Bundle,
      label: "tabs.bundle",
      content: <StakingBundle />,
    },
  ] as const

  return (
    <PageContainer title={t("welcome")} subtitle={t("howToUse")}>
      <TabContainer tabs={tabs} defaultTab={DemoTabs.Steps} t={t} />
    </PageContainer>
  )
}
