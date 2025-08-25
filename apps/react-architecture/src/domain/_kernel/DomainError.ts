import { z } from "zod"
import { ErrorCodes } from "./ErrorCodes"

export const DomainErrorValidation = z.object({
  code: z.nativeEnum(ErrorCodes),
  error: z.instanceof(Error).optional(),
})

export type DomainErrorSerialized = ReturnType<DomainError["serialize"]>

export class DomainError {
  constructor(
    private readonly _code: ErrorCodes,
    private readonly _error: Error,
  ) {}

  static create({ code, error }: z.infer<typeof DomainErrorValidation>) {
    const { error: validationError, data, success } = DomainErrorValidation.safeParse({ code, error })

    if (!success) throw new Error(validationError.message)

    return new DomainError(data.code, data.error ?? new Error("Unknown error"))
  }

  get code() { return this._code } // prettier-ignore
  get error() { return this._error } // prettier-ignore

  serialize() {
    return {
      code: this._code,
      error: this._error,
    }
  }
}
