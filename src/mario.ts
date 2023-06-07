/**
 * The `UnoHandler` function processes a raw input string and returns a CSS value or `null` if
 * the handler cannot process the value. The context object can be optionally used to provide
 * additional data for the value processing.
 */
export type UnoHandler<C = undefined> = (str: string, ctx: C) => string | number | null 

type ExtractContext<T> = T extends UnoHandler<infer C> ? C : never
type UnoMarioStyles =  [string, string | number][]

/**
 * The `UnoMario` class enables the chaining and combination of multiple handlers to process input
 * strings and generate CSS values. The input value traverses through the handler pipeline until
 * the first non-null value is returned. At that point, the remaining handlers are bypassed, and
 * the computed value is used to build the CSS styles.
 */
export interface UnoMario<H extends Record<string, UnoHandler<any>>> {

  /** The `pipe` method appends a handler and its corresponding options to the pipeline. */
  pipe<T extends keyof H>(handler: T, options?: ExtractContext<H[T]>): UnoMario<H>

  /** 
   * The `toStyles` method initiates the pipeline and returns the generated styles when the value
   * is valid; otherwise, it returns `undefined`. Upon completion, the pipeline automatically
   * removes all previously added handlers that were added using the `pipe` method.
   */
  toStyles(properties: string | string[], matchStr: string): UnoMarioStyles | undefined
}

export class Mario<H extends Record<string, UnoHandler<any>>> implements UnoMario<H> {
  private sequence = new Map<keyof H, any>()

  constructor(private handlers: H) { }

  pipe<T extends keyof H>(handler: T, options?: ExtractContext<H[T]>): UnoMario<H> {
    this.sequence.set(handler, options)
    return this
  }

  toStyles(properties: string | string[], matchStr: string): UnoMarioStyles | undefined {
    for (const [handler, options] of this.sequence.entries()) {
      const value = this.handlers[handler](matchStr, options)
      if (value === null) continue
      this.sequence.clear()
      return this.toArray(properties).map(property => [property, value])
    }
  }

  private toArray(properties: string | string[]): string[] {
    return Array.isArray(properties) ? properties : [properties]
  }

  static of<H extends Record<string, UnoHandler<any>>>(handlers: H) {
    return new Mario(handlers)
  }
}
