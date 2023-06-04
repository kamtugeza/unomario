import type { CSSEntries } from '@unocss/core'

export type UnoHandler<C = undefined> = (str: string, ctx: C) => string | number | null 

export interface UnoMario<H extends Record<string, UnoHandler<any>>> {
  pipe<T extends keyof H>(handler: T, options?: ExtractContext<H[T]>): UnoMario<H>
  toStyles(properties: string | string[], matchStr: string): CSSEntries | null
}

type ExtractContext<T> = T extends UnoHandler<infer C> ? C : never

export class Mario<H extends Record<string, UnoHandler<any>>> implements UnoMario<H> {
  private sequence = new Map<keyof H, any>()

  constructor(private handlers: H) { }

  pipe<T extends keyof H>(handler: T, options?: ExtractContext<H[T]>): UnoMario<H> {
    this.sequence.set(handler, options)
    return this
  }

  toStyles(properties: string | string[], matchStr: string): CSSEntries | null {
    for (const [handler, options] of this.sequence.entries()) {
      const value = this.handlers[handler](matchStr, options)
      if (value === null) continue
      this.sequence.clear()
      return this.toArray(properties).map(property => [property, value])
    }
    return null
  }

  private toArray(properties: string | string[]): string[] {
    return Array.isArray(properties) ? properties : [properties]
  }

  static of<H extends Record<string, UnoHandler<any>>>(handlers: H) {
    return new Mario(handlers)
  }
}
