/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <overflow-menu></overflow-menu>
 * ```
 */
const stylesheet = new CSSStyleSheet()
stylesheet.replaceSync(`
  :host {
    display: flex;
    gap: 0.5em;
  }
  div {
    position: relative;
  }
  #overflow {
    position: absolute;
  }
  ::slotted(overflow-menu-item::part(label)) {
    display: none
  }
`)

const resizeObserver = new ResizeObserver(records => {
  for (const record of records) {
    if (record.target instanceof OverflowMenuElement) {
      record.target.assignElements()
    }
  }
})

class OverflowMenuElement extends HTMLElement {
  #renderRoot!: ShadowRoot

  #mainSlot: HTMLSlotElement
  #overflowSlot: HTMLSlotElement
  #button: HTMLButtonElement
  #overflow: HTMLElement

  async connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open', slotAssignment: 'manual'})
    this.#renderRoot.innerHTML = `
      <slot></slot>
      <div>
        <button id="more">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
        <div id="overflow" hidden>
          <slot name="overflow"></slot>
        </div>
      </div>
    `
    this.#button = this.#renderRoot.querySelector('button')!
    this.#overflow = this.#renderRoot.querySelector('#overflow')!
    this.#mainSlot = this.#renderRoot.querySelector('slot:not([name])')!
    this.#overflowSlot = this.#renderRoot.querySelector('slot[name=overflow]')!
    this.#renderRoot.adoptedStyleSheets.push(stylesheet)
    this.#renderRoot.addEventListener('click', this)
    resizeObserver.observe(this)
    await Promise.resolve()
    this.assignElements()
  }

  assignElements() {
    const els = this.querySelectorAll('overflow-menu-item')
    this.#mainSlot.assign(...els)
    let totalWidth = this.getBoundingClientRect().width
    const overflowEls = []
    for (const el of els) {
      const width = el.getBoundingClientRect().width
      if (totalWidth - width < 0) {
        overflowEls.push(el)
      }
      totalWidth -= width
    }
    this.#overflowSlot.assign(...overflowEls)
  }

  handleEvent(event: Event) {
    if (event.type === 'click' && event.target.closest('button') === this.#button) {
      this.#overflow.hidden = !this.#overflow.hidden
    }
  }
}

const itemStylesheet = new CSSStyleSheet()
itemStylesheet.replaceSync(`
  :host {
    display: flex;
    place-items: center;
    min-width: 100px;
  }
`)
// eslint-disable-next-line
class OverflowMenuItemElement extends HTMLElement {
  #renderRoot!: ShadowRoot

  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open'})
    this.#renderRoot.innerHTML = `<slot name="icon"></slot><slot part="label"></slot>`
    this.#renderRoot.adoptedStyleSheets.push(itemStylesheet)
  }
}

declare global {
  interface Window {
    OverflowMenuElement: typeof OverflowMenuElement
  }
}

export default OverflowMenuElement

if (!window.customElements.get('overflow-menu')) {
  window.OverflowMenuElement = OverflowMenuElement
  window.customElements.define('overflow-menu', OverflowMenuElement)
}

if (!window.customElements.get('overflow-menu-item')) {
  window.OverflowMenuItemElement = OverflowMenuItemElement
  window.customElements.define('overflow-menu-item', OverflowMenuItemElement)
}
