import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class Equalizer extends Component {
  constructor(){
    super()
    this.handleResize          = this.handleResize.bind(this)
    this.updateChildrenHeights = this.updateChildrenHeights.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate() {
    this.handleResize()
  }

  handleResize() {
    setTimeout(this.updateChildrenHeights, 0)
  }

  static getHeights(nodes, byRow = true) {
    let lastElTopOffset = 0,
        groups          = [],
        row             = 0

    groups[row] = []

    for(let i = 0; i < nodes.length; i++){
      let node = nodes[i]

      node.style.height    = 'auto'
      node.style.maxHeight = ''
      node.style.minHeight = ''

      const elOffsetTop = node.offsetTop
      const elHeight    = node.offsetHeight

      if(i === 0) {
        lastElTopOffset = elOffsetTop
      }

      if (elOffsetTop != lastElTopOffset && byRow) {
        row++
        groups[row] = []
        lastElTopOffset = elOffsetTop
      }

      groups[row].push([node, elHeight])
    }

    for (let j = 0; j < groups.length; j++) {
      const heights = groups[j].map((item) => item[1])
      const max     = Math.max.apply(null, heights)
      groups[j].push(max)
    }

    return groups
  }

  updateChildrenHeights() {
    const { property, byRow, enabled } = this.props
    const node = ReactDOM.findDOMNode(this)

    if (!enabled(node)) {
      return
    }

    if (node !== undefined && node.children) {
      const heights = this.constructor.getHeights(node.children, byRow)

      for (let row = 0; row < heights.length; row++) {
        const max = heights[row][heights[row].length-1]

        for (let i = 0; i < (heights[row].length - 1); i++) {
          heights[row][i][0].style[property] = max + 'px'
        }
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

Equalizer.defaultProps = {
  property: 'height',
  byRow:    true,
  enabled:  () => true
}

Equalizer.propTypes = {
  children: React.PropTypes.node.isRequired,
  property: React.PropTypes.string,
  byRow:    React.PropTypes.bool,
  enabled:  React.PropTypes.func
}