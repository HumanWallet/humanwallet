import { useTranslation } from "react-i18next"
import { redirect } from "react-router"
import { WalletState } from "../../domain/ethereum/Models/WalletState"
import { StakingSteps, StakingBundle } from "../../components/modules/Staking"
import { TabContainer, PageContainer } from "../../components/ui"

enum DemoTabs {
  Steps = "steps",
  Bundle = "bundle",
}

export const loader = async () => {
  const walletState = await window.domain.GetWalletStateEthereumUseCase.execute()

  if (walletState.status !== WalletState.STATUS.CONNECTED) {
    return redirect("/connect")
  }

  return null
}

export function Component() {
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
