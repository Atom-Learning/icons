const { test } = require('node:test')
const assert = require('node:assert/strict')
const icons = require('@atom-learning/icons')

test('CJS: package resolves via exports map in a Node SSR context', () => {
  assert.ok(Object.keys(icons).length > 0, 'expected named exports')
})

test('CJS: known icons are exported as React components', () => {
  for (const name of ['Accessibility', 'Activity', 'Add']) {
    assert.equal(typeof icons[name], 'object', `${name} should be a forwardRef component`)
    assert.equal(icons[name].displayName, name)
  }
})
