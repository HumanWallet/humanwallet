import { Chain, createPublicClient, http, PublicClient, Transport } from 'viem';
import {
  createKernelAccount,
  createKernelAccountClient,
  CreateKernelAccountReturnType,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
  KernelAccountClient,
  ZeroDevPaymasterClient,
} from '@zerodev/sdk';
import {
  toPasskeyValidator,
  PasskeyValidatorContractVersion,
  KernelValidator,
} from '@zerodev/passkey-validator';
import {
  toWebAuthnKey,
  WebAuthnMode,
  type WebAuthnKey,
} from '@zerodev/webauthn-key';
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants';
import { SessionStorageRepositoryInterface } from './types/sessionStorage';
import { SessionStorageRepository } from './domain/sessionStorage';

export type HumanWalletSDKConfig = {
  bundlerRpc: string;
  paymasterRpc: string;
  passkeyUrl: string;
  chain: Chain;
};

export class HumanWalletSDK {
  private readonly bundlerTransport: Transport;
  private readonly paymasterTransport: Transport;
  private readonly paymasterClient: ZeroDevPaymasterClient;
  public readonly publicClient: PublicClient;
  private readonly sessionStorageRepository: SessionStorageRepositoryInterface =
    SessionStorageRepository.create();
  private kernelClient: KernelAccountClient | null = null;
  private kernelAccount: CreateKernelAccountReturnType<'0.7'> | null = null;

  constructor(
    private bundlerRpc: string,
    private paymasterRpc: string,
    private passkeyUrl: string,
    private chain: Chain
  ) {
    this.bundlerTransport = http(bundlerRpc);
    this.paymasterTransport = http(paymasterRpc);
    this.publicClient = createPublicClient({
      chain,
      transport: this.bundlerTransport,
    });
    this.paymasterClient = createZeroDevPaymasterClient({
      chain,
      transport: this.paymasterTransport,
    });
    this.kernelClient = null;
    this.kernelAccount = null;
  }

  private async getPasskeyValidator(
    webAuthnKey: WebAuthnKey
  ): Promise<KernelValidator> {
    return await toPasskeyValidator(this.publicClient, {
      webAuthnKey,
      entryPoint: getEntryPoint('0.7'),
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    });
  }

  private async generateWebAuthnKey(
    username: string,
    mode: WebAuthnMode
  ): Promise<WebAuthnKey> {
    return await toWebAuthnKey({
      passkeyName: username,
      passkeyServerUrl: this.passkeyUrl,
      mode,
      passkeyServerHeaders: {},
    });
  }

  private async createAccountAndClient(
    passkeyValidator: KernelValidator
  ): Promise<void> {
    this.kernelAccount = await createKernelAccount(this.publicClient, {
      entryPoint: getEntryPoint('0.7'),
      plugins: {
        sudo: passkeyValidator,
      },
      kernelVersion: KERNEL_V3_1,
    });

    this.kernelClient = createKernelAccountClient({
      account: this.kernelAccount,
      chain: this.chain,
      client: this.publicClient,
      bundlerTransport: this.bundlerTransport,
      paymaster: {
        getPaymasterData: (userOperation) => {
          return this.paymasterClient.sponsorUserOperation({ userOperation });
        },
      },
      userOperation: {
        estimateFeesPerGas: async ({ bundlerClient }) => {
          return getUserOperationGasPrice(bundlerClient);
        },
      },
    });
  }

  public async register(
    username: string
  ): Promise<CreateKernelAccountReturnType<'0.7'> | null> {
    const webAuthnKey = await this.generateWebAuthnKey(
      username,
      WebAuthnMode.Register
    );
    await this.sessionStorageRepository.setWebAuthnKey(webAuthnKey);

    const passkeyValidator = await this.getPasskeyValidator(webAuthnKey);
    await this.createAccountAndClient(passkeyValidator);
    return this.kernelAccount;
  }

  public async login(
    username: string
  ): Promise<CreateKernelAccountReturnType<'0.7'> | null> {
    const webAuthnKey = await this.generateWebAuthnKey(
      username,
      WebAuthnMode.Login
    );
    const webAuthnKey = await this.sessionStorageRepository.getWebAuthnKey();
    if (!webAuthnKey) return null;

    const passkeyValidator = await this.getPasskeyValidator(webAuthnKey);
    await this.createAccountAndClient(passkeyValidator);
    return this.kernelAccount;
  }

  public async disconnect(): Promise<void> {
    this.kernelClient = null;
    this.kernelAccount = null;
    await this.sessionStorageRepository.deleteWebAuthnKey();
  }

  public async reconnect(): Promise<CreateKernelAccountReturnType<'0.7'> | null> {
    const webAuthnKey = await this.sessionStorageRepository.getWebAuthnKey();
    if (!webAuthnKey) return null;

    const passkeyValidator = await this.getPasskeyValidator(webAuthnKey);
    await this.createAccountAndClient(passkeyValidator);
    return this.kernelAccount;
  }
}
