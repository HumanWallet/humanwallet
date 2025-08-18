import { Hola, HolaInterface } from "./hola"

export interface ExtendedHolaInterface extends HolaInterface {
  saludarExtended(): Promise<string>
}

export class ExtendedHola extends Hola implements ExtendedHolaInterface {
  static create() {
    return new ExtendedHola()
  }

  constructor() {
    super()
  }

  public async saludarExtended() {
    return (await super.saludar()) + " extended"
  }
}
