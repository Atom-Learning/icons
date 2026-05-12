import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as icons from '@atom-learning/icons'

test('ESM: package resolves via exports map in a Node SSR context', () => {
  assert.ok(Object.keys(icons).length > 0, 'expected named exports')
})

test('ESM: known icons are exported as React components', () => {
  for (const name of ['Accessibility', 'Activity', 'Add']) {
    assert.equal(typeof icons[name], 'object', `${name} should be a forwardRef component`)
    assert.equal(icons[name].displayName, name)
  }
})
