import { useState } from "react"
import { useTranslation } from "react-i18next"
import { redirect } from "react-router"
import { Heading, Tab, Tabs } from "@tutellus/tutellus-components"
import { WalletState } from "../../domain/ethereum/Models/WalletState"
import { StakingSteps, StakingBundle } from "../../components/modules/Staking"
import styles from "./index.module.css"

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
  const [selectedTab, setSelectedTab] = useState(DemoTabs.Steps)

  const handleTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tab = e.target.value as DemoTabs
    setSelectedTab(tab)
  }

  return (
    <div className={styles.container}>
      <Heading as="h1" align="center">
        {t("welcome")}
      </Heading>
      <Heading as="h2" align="center">
        {t("howToUse")}
      </Heading>
      <div className={styles.content}>
        <div className={styles.tabs}>
          <Tabs>
            <Tab
              label={t("tabs.steps")}
              value={DemoTabs.Steps}
              onChange={handleTabChange}
              checked={selectedTab === DemoTabs.Steps}
            />
            <Tab
              label={t("tabs.bundle")}
              value={DemoTabs.Bundle}
              onChange={handleTabChange}
              checked={selectedTab === DemoTabs.Bundle}
            />
          </Tabs>
        </div>
        {selectedTab === DemoTabs.Steps && <StakingSteps />}
        {selectedTab === DemoTabs.Bundle && <StakingBundle />}
      </div>
    </div>
  )
}
