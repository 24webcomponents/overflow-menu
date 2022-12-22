import {assert, fixture, html} from '@open-wc/testing'
import '../src/overflow-menu-element'

describe('overflow-menu', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('overflow-menu')
      assert.equal('OVERFLOW-MENU', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.OverflowMenuElement()
      assert.equal('OVERFLOW-MENU', el.nodeName)
    })
  })

  describe('after tree insertion', function () {
    beforeEach(async function () {
      await fixture(html` <overflow-menu></overflow-menu>`)
    })

    it('initiates', function () {
      const ce = document.querySelector('overflow-menu')
      assert.equal(ce?.textContent, ':wave:')
    })
  })
})
