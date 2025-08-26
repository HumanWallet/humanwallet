import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { Button, Card } from "@tutellus/tutellus-components"
import { parseUnits, encodeFunctionData, type Hash } from "viem"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useSendCalls } from "wagmi"
import { StakingSuccess } from "./StakingSuccess"
import { MINT_AMOUNT } from "./config"
import { TokenAmount } from "../tokenAmount"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI"
import { STAKING_ABI } from "../../../contracts/abis/stakingABI"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses"
import styles from "./index.module.css"

export const StakingBundle = () => {
  const { t } = useTranslation("demo")
  const { address } = useAccount()
  const [successTx, setSuccessTx] = useState<string | null>(null)

  // Fetch token decimals
  const { data: decimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get decimals or default to 18 if not loaded yet
  const decimals = decimalsData ? Number(decimalsData) : 18

  // Use wagmi's useSendCalls for batch transactions
  const { sendCalls, data: batchData, isPending: isBatchPending } = useSendCalls()

  // Wait for batch transaction receipt
  const { data: batchReceipt } = useWaitForTransactionReceipt({
    hash: batchData?.id as Hash,
  })

  // Handle batch transaction completion
  useEffect(() => {
    if (batchReceipt && batchData) {
      // batchData contains the call ID, use the receipt transaction hash
      setSuccessTx(batchReceipt.transactionHash)
    }
  }, [batchReceipt, batchData])

  const handleMintAndStake = () => {
    if (!address) return

    // Create batch of calls using useSendCalls
    sendCalls(
      {
        calls: [
          // 1. Mint tokens
          {
            to: CONTRACT_ADDRESSES.TOKEN,
            data: encodeFunctionData({
              abi: TOKEN_ABI,
              functionName: "mint",
              args: [address, parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
          // 2. Approve tokens for staking
          {
            to: CONTRACT_ADDRESSES.TOKEN,
            data: encodeFunctionData({
              abi: TOKEN_ABI,
              functionName: "approve",
              args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
          // 3. Stake tokens
          {
            to: CONTRACT_ADDRESSES.STAKING,
            data: encodeFunctionData({
              abi: STAKING_ABI,
              functionName: "deposit",
              args: [parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
        ],
      },
      {
        onSuccess: (data) => {
          console.log("Batch transaction successful:", data)
        },
        onError: (error) => {
          console.error("Batch transaction failed:", error)
        },
      },
    )
  }

  // Reset function
  const handleReset = () => {
    setSuccessTx(null)
  }

  return (
    <Card>
      {successTx ? (
        <StakingSuccess successTx={successTx} onReset={handleReset} />
      ) : (
        <div className={styles.stepContent}>
          <p>{t("steps.bundle.header")}</p>
          <TokenAmount amount={MINT_AMOUNT} />
          <Button
            onClick={handleMintAndStake}
            isLoading={isBatchPending}
            isDisabled={!decimalsData}
            isFull
            color="accent"
          >
            {t("steps.bundle.button")}
          </Button>
        </div>
      )}
    </Card>
  )
}
