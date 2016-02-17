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

  getHeightsByRow(nodes, byRow = true) {
    let lastElTopOffset = nodes[0].offsetTop,
        groups          = [],
        row             = 0

    groups[row] = []

    for(let i = 0; i < nodes.length; i++){
      nodes[i].style.height = 'auto'

      const elOffsetTop = nodes[i].offsetTop
      const elHeight    = nodes[i].offsetHeight

      if (elOffsetTop != lastElTopOffset && byRow) {
        row++
        groups[row] = []
        lastElTopOffset = elOffsetTop
      }

      groups[row].push([nodes[i], nodes[i].offsetHeight])
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
      const heights = this.getHeightsByRow(node.children, byRow)

      for (let row = 0; row < heights.length; row++) {
        const max = heights[row][heights[row].length-1]

        for (let i = 0; i < (heights[row].length - 1); i++) {
          heights[row][i][0].style[property] = max
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