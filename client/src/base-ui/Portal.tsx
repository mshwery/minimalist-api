import React from 'react'
import ReactDOM from 'react-dom'

let portalContainer: HTMLDivElement

export class Portal extends React.Component<{}> {
  el: HTMLDivElement

  constructor(props: {}) {
    super(props)

    if (!portalContainer) {
      portalContainer = document.createElement('div')
      portalContainer.className = '__base-ui-portal'
      document.body.append(portalContainer)
    }

    this.el = document.createElement('div')
    portalContainer.append(this.el)
  }

  componentWillUnmount() {
    if (this.el) {
      portalContainer.removeChild(this.el)
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}
