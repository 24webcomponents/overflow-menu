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
class OverflowMenuElement extends HTMLElement {
  connectedCallback(): void {
    this.textContent = ':wave:'
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
