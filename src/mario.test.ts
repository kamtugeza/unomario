import type { UnoMapper } from './mario'
import { expect, it} from 'vitest'
import { Mario } from './mario'

function auto(opts?: { skip?: boolean }): UnoMapper {
  return val => !opts?.skip && val === 'auto' ? 'auto' : null
}

function bracket(): UnoMapper {
  return val => val.startsWith('[') && val.endsWith(']') ? val.slice(1, -1) : null
}

it('should return an empty array when no handlers has been provided', () => {
  expect(Mario.of('width', 'none').toStyles())
    .toEqual([])
})

it('should return an empty array when the value has not been processed by mappers', () => {
  expect(Mario.of('width', 'none').toStyles(bracket(), auto()))
    .toEqual([])
})

it('should return a CSS entities when the value has been processed', () => {
  expect(Mario.of('width', 'auto').toStyles(auto()))
    .toEqual([['width', 'auto']])
  expect(Mario.of('width', '[80px]').toStyles(bracket(), auto()))
    .toEqual([['width', '80px']])
  expect(Mario.of(['margin-left', 'margin-right'], '[80px]').toStyles(bracket(), auto()))
    .toEqual([['margin-left', '80px'], ['margin-right', '80px']])
})
