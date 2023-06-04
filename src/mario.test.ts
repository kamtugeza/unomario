import { expect, it, vi } from 'vitest'
import { Mario } from './mario'

function buildTest() {
  const auto = vi.fn((str, opts) => !opts?.skip && str === 'auto' ? 'auto' : null)
  const bracket = vi.fn(str => str.startsWith('[') && str.endsWith(']') ? str.slice(1, -1) : null)
  const mario = Mario.of({ auto, bracket })
  return { auto, bracket, mario }
}

it('should return `undefined` when no handlers has been provided', () => {
  const mario = new Mario({})
  expect(mario.toStyles('width', 'none')).toBe(undefined)
})

it('should return `undefined` when the match string has not been processed by handlers', () => {
  const { mario } = buildTest()
  expect(mario.pipe('auto').toStyles('width', 'none')).toBe(undefined)
})

it('should return a CSS entities when the match string has been processed', () => {
  const { mario } = buildTest()
  expect(mario.pipe('bracket').pipe('auto').toStyles('width', 'auto'))
    .toEqual([['width', 'auto']])
  expect(mario.pipe('bracket').pipe('auto').toStyles('width', '[80px]'))
    .toEqual([['width', '80px']])
  expect(mario.pipe('bracket').pipe('auto').toStyles(['margin-left', 'margin-right'], '[80px]'))
    .toEqual([['margin-left', '80px'], ['margin-right', '80px']])
})

it('should cleanup the pipeline after building css entities', () => {
  const { mario } = buildTest()
  mario.pipe('bracket').toStyles('width', '[10vw]')
  expect(mario.pipe('auto').toStyles('width', '[20vw]')).toBe(undefined)
})

it('should pass an options to a handler on processing', () => {
  const { auto, mario } = buildTest()
  expect(mario.pipe('auto', { skip: true }).toStyles('max-width', 'auto')).toBe(undefined)
  expect(auto).toHaveBeenCalledWith('auto', { skip: true })
})
