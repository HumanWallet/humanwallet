import { useState } from "react"
import type { TFunction } from "i18next"
import type { ReactElement } from "react"
import { Tab, Tabs } from "@tutellus/tutellus-components"
import styles from "./index.module.css"

interface TabItem {
  readonly id: string
  readonly label: string
  readonly content: ReactElement
}

interface TabContainerProps {
  readonly tabs: readonly TabItem[]
  readonly defaultTab?: string
  readonly t: TFunction
}

export const TabContainer = ({ tabs, defaultTab, t }: TabContainerProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab ?? tabs[0]?.id ?? "")

  const handleTabChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedTab(e.target.value)
  }

  const activeTab = tabs.find((tab) => tab.id === selectedTab)

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <Tabs>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={t(tab.label)}
              value={tab.id}
              onChange={handleTabChange}
              checked={selectedTab === tab.id}
            />
          ))}
        </Tabs>
      </div>

      <div className={styles.content}>{activeTab?.content}</div>
    </div>
  )
}
