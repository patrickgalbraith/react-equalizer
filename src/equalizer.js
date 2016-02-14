import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class Equalizer extends Component {
  constructor(){
    super()
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate() {
    this.handleResize()
  }

  handleResize() {
    window.setTimeout(this.updateChildrenHeights(), 0)
  }

  updateChildrenHeights() {
    const node = ReactDOM.findDOMNode(this)
    let maxHeight = 0

    if (node !== undefined) {
      for (let i=0; i < node.children.length; i++) {
        let childEl = node.children[i]

        childEl.style.height = ''

        let height = childEl.clientHeight

        if(height > maxHeight) {
          maxHeight = height
        }
      }

      for (let i=0; i < node.children.length; i++) {
        let childEl = node.children[i]
        childEl.style.height = maxHeight
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

Equalizer.propTypes = {
  children: React.PropTypes.node.isRequired
}