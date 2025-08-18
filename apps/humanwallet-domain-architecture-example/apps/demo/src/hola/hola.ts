export interface HolaInterface {
  saludar(): Promise<string>
}

export class Hola {
  static create() {
    return new Hola()
  }

  constructor() {}

  public async saludar() {
    return "hola"
  }
}
