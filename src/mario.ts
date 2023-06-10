import type { CSSEntries } from '@unocss/core'

export type UnoMapper = (value: string) => string | number | null

export interface UnoMario {
  toStyles(...mappers: UnoMapper[]): CSSEntries
}

export class Mario implements UnoMario {
  private readonly input: string = ''
  private properties: string[] = []

  constructor(properties: string | string[], input: string) {
    this.properties = Array.isArray(properties) ? properties : [properties]
    this.input = input
  }

  toStyles(...mappers: UnoMapper[]): CSSEntries {
    for (const mapper of mappers) {
      const result = mapper(this.input)
      if (result === null) continue
      return this.properties.map(property => [property, result])
    }
    return []
  }

  static of(properties: string | string[], value: string) {
    return new Mario(properties, value) 
  }
}
