jest.dontMock('../src/equalizer');

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');

const Equalizer = require('../src/equalizer').default;

const getMaxHeight = (heights) => heights[heights.length-1]

const mockFactory = function(values) {
  return function(){
    return values
  }
}

describe('Equalizer', () => {
  let inlineNodes, stackedNodes;

  beforeEach(function() {
    inlineNodes = [
      {
        getBoundingClientRect: mockFactory({
          top: 0,
          height: 50
        }),
        style: {}
      },
      {
        getBoundingClientRect: mockFactory({
          top: 0,
          height: 150
        }),
        style: {}
      },
      {
        getBoundingClientRect: mockFactory({
          top: 0,
          height: 100
        }),
        style: {}
      }
    ]

    stackedNodes = [
      {
        getBoundingClientRect: mockFactory({
          top: 0,
          height: 50
        }),
        style: {}
      },
      {
        getBoundingClientRect: mockFactory({
          top: 0,
          height: 100
        }),
        style: {}
      },
      {
        getBoundingClientRect: mockFactory({
          top: 200,
          height: 125
        }),
        style: {}
      },
      {
        getBoundingClientRect: mockFactory({
          top: 200,
          height: 50
        }),
        style: {}
      }
    ]
  })

  describe('.getHeights', function() {
    it('resets height for all nodes for recalculation', () => {
      let result = Equalizer.getHeights(inlineNodes)

      result.forEach((row) => {
        row.forEach((item) => {
          if(Array.isArray(item)) {
            expect(item[0].style.height).toEqual('auto')
            expect(item[0].style.maxHeight).toEqual('')
            expect(item[0].style.minHeight).toEqual('')
          }
        })
      })
    })

    it('calculates max height for inline nodes', () => {
      // byRow = true
      let result = Equalizer.getHeights(inlineNodes, true)
      expect(result.length).toEqual(1)
      expect(result[0].length).toEqual(4)
      expect(getMaxHeight(result[0])).toEqual(150)
    })

    it('calculates max height for inline nodes when byrow is disabled', () => {
      // byRow = false
      let result = Equalizer.getHeights(inlineNodes, false)
      expect(result.length).toEqual(1)
      expect(result[0].length).toEqual(4)
      expect(getMaxHeight(result[0])).toEqual(150)
    })

    it('calculates max height for stacked nodes', () => {
      // byRow = true
      let result = Equalizer.getHeights(stackedNodes, true)

      expect(result.length).toEqual(2)

      // Row 1
      expect(result[0].length).toEqual(3)
      expect(getMaxHeight(result[0])).toEqual(100)

      // Row 2
      expect(result[1].length).toEqual(3)
      expect(getMaxHeight(result[1])).toEqual(125)
    })

    it('calculates max height for stacked nodes when byrow is disabled', () => {
      // byRow = false
      let result = Equalizer.getHeights(stackedNodes, false)

      expect(result.length).toEqual(1)
      expect(result[0].length).toEqual(5)
      expect(getMaxHeight(result[0])).toEqual(125)
    })
  })

  describe('component', function() {
    it('sets children heights to the tallest child', (done) => {
      spyOn(Equalizer, 'getHeights').andCallFake(() => {
        return [[
          [el.children[0], 0],
          [el.children[1], 150],
          [el.children[2], 0],
          150
        ]]
      })

      let component = TestUtils.renderIntoDocument(
        <Equalizer>
          <div></div>
          <div></div>
          <div></div>
        </Equalizer>
      )

      let el = ReactDOM.findDOMNode(component)

      jest.runAllTimers()

      expect(Equalizer.getHeights).toHaveBeenCalled()

      for (var i=0; i < el.children.length; i++) {
        var childNode = el.children[i]
        expect(childNode.style.height).toEqual('150px')
      }
    })

    it('sets children heights to the tallest child in the same row', (done) => {
      spyOn(Equalizer, 'getHeights').andCallFake(() => {
        return [
          [
            [el.children[0], 75],
            [el.children[1], 100],
            100
          ],
          [
            [el.children[2], 50],
            [el.children[3], 125],
            125
          ]
        ]
      })

      let component = TestUtils.renderIntoDocument(
        <Equalizer>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Equalizer>
      )

      let el = ReactDOM.findDOMNode(component)

      jest.runAllTimers()

      expect(Equalizer.getHeights).toHaveBeenCalled()

      for (var i=0; i < el.children.length; i++) {
        var childNode = el.children[i]

        if(i < 2) {
          expect(childNode.style.height).toEqual('100px')
        } else {
          expect(childNode.style.height).toEqual('125px')
        }
      }
    })

    it('sets children minheights to the tallest child through custom property', (done) => {
      spyOn(Equalizer, 'getHeights').andCallFake(() => {
        return [[
          [el.children[0], 0],
          [el.children[1], 150],
          [el.children[2], 0],
          150
        ]]
      })

      let component = TestUtils.renderIntoDocument(
        <Equalizer property='minHeight'>
          <div></div>
          <div></div>
          <div></div>
        </Equalizer>
      )

      let el = ReactDOM.findDOMNode(component)

      jest.runAllTimers()

      expect(Equalizer.getHeights).toHaveBeenCalled()

      for (var i=0; i < el.children.length; i++) {
        var childNode = el.children[i]
        expect(childNode.style.minHeight).toEqual('150px')
      }
    })

    it('allows setting specific nodes to the tallest node by ref', (done) => {
      let allNodes = null

      const TestComponent = React.createClass({
        getNodes() {
          allNodes = [
            this.refs.node1,
            this.refs.node2,
            this.refs.node3,
            this.refs.node4
          ]
          return allNodes
        },

        render() {
          return(
            <Equalizer nodes={this.getNodes}>
              <div ref="node1"></div>
              <div ref="node2">
                <div ref="node3"></div>
              </div>
              <div ref="node4"></div>
            </Equalizer>
          )
        }
      })

      spyOn(Equalizer, 'getHeights').andCallFake(() => {
        return [[
          [ReactDOM.findDOMNode(allNodes[0]), 0],
          [ReactDOM.findDOMNode(allNodes[2]), 150],
          [ReactDOM.findDOMNode(allNodes[3]), 0],
          150
        ]]
      })

      let component = TestUtils.renderIntoDocument(<TestComponent />)
      let el        = ReactDOM.findDOMNode(component)

      jest.runAllTimers()

      expect(Equalizer.getHeights).toHaveBeenCalled()

      expect(ReactDOM.findDOMNode(allNodes[0]).style.height).toEqual('150px')
      expect(ReactDOM.findDOMNode(allNodes[1]).style.height).not.toEqual('150px')
      expect(ReactDOM.findDOMNode(allNodes[2]).style.height).toEqual('150px')
      expect(ReactDOM.findDOMNode(allNodes[3]).style.height).toEqual('150px')
    })

    it('can be disabled', (done) => {
      spyOn(Equalizer, 'getHeights')

      let component = TestUtils.renderIntoDocument(
        <Equalizer enabled={() => false}>
          <div></div>
        </Equalizer>
      )

      let el = ReactDOM.findDOMNode(component)

      jest.runAllTimers()

      expect(Equalizer.getHeights).not.toHaveBeenCalled()
    })
  })
})