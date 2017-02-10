import React, { Component, PropTypes } from 'react'

export default class Equalizer extends Component {
  constructor() {
    super()
    this.handleResize          = debounce(this.handleResize.bind(this), 50)
    this.updateChildrenHeights = this.updateChildrenHeights.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    this.rootNode = null
    this.handleResize.clear()
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

      // http://ejohn.org/blog/getboundingclientrect-is-awesome/
      const {top: elOffsetTop, height: elHeight} = node.getBoundingClientRect()

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
    const node = this.rootNode

    if (!node || !enabled(this, node)) {
      return
    }

    if (node !== undefined) {
      const children = this.props.nodes(this, node)
      const heights  = this.constructor.getHeights(children, byRow)

      for (let row = 0; row < heights.length; row++) {
        const max = heights[row][heights[row].length-1]

        for (let i = 0; i < (heights[row].length - 1); i++) {
          heights[row][i][0].style[property] = max + 'px'
        }
      }
    }
  }

  render() {
    const {children, property, byRow, enabled, nodes, ...otherProps} = this.props
    return (
      <div ref={node => this.rootNode = node} onLoad={this.handleResize} {...otherProps}>
        {children}
      </div>
    )
  }
}

Equalizer.defaultProps = {
  property: 'height',
  byRow:    true,
  enabled:  () => true,
  nodes:    (component, node) => node.children
}

Equalizer.propTypes = {
  children: PropTypes.node.isRequired,
  property: PropTypes.string,
  byRow:    PropTypes.bool,
  enabled:  PropTypes.func,
  nodes:    PropTypes.func
}

// from: https://github.com/component/debounce
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result
  if (null == wait) wait = 100

  function later() {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  var debounced = function(){
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}