export interface UseCase<Input, Output> {
  execute: (params: Input) => Promise<Output>
}

export interface Service<Input, Output> {
  execute: (params: Input) => Promise<Output>
}
