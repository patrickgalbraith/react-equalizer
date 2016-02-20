jest.dontMock('../src/equalizer');

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');

const Equalizer = require('../src/equalizer').default;

const generateEqualizerMock = (getNodeOffsetTop, getNodeHeight) => {
  class EqualizerMock extends Equalizer {
    getNodeOffsetTop(...args) {
      return getNodeOffsetTop(...args)
    }

    getNodeHeight(...args) {
      return getNodeHeight(...args)
    }
  }

  return EqualizerMock
}

describe('Equalizer', () => {

  it('sets children heights to the tallest child', (done) => {
    var baseHeight = '100px';

    var EqualizerMock = generateEqualizerMock(
      (node) => {
        return 0
      },
      (node) => {
        if(node.previousElementSibling) {
          return (+baseHeight) - 10
        } else {
          return +baseHeight
        }
      }
    )

    var element = TestUtils.renderIntoDocument(
      <EqualizerMock>
        <div></div>
        <div></div>
        <div></div>
      </EqualizerMock>
    );

    jest.runAllTimers();

    var el = ReactDOM.findDOMNode(element);

    for (var i=0; i < el.children.length; i++) {
      var childNode = el.children[i];
      expect(childNode.style.height).toEqual(baseHeight);
    }
  })

  it('sets children heights to the tallest child in the same row', (done) => {
    var baseHeight = '100px';

    var EqualizerMock = generateEqualizerMock(
      (node) => {
        return +node.getAttribute('data-row')
      },
      (node) => {
        var prevRow = node.previousElementSibling ? +node.previousElementSibling.getAttribute('data-row') : 0
        var curRow  = +node.getAttribute('data-row')

        if(prevRow === curRow) {
          return (+baseHeight) - 10
        } else {
          return +baseHeight
        }
      }
    )

    var element = TestUtils.renderIntoDocument(
      <EqualizerMock>
        <div data-row={1}></div>
        <div data-row={1}></div>
        <div data-row={1}></div>
        <div data-row={2}></div>
        <div data-row={2}></div>
        <div data-row={2}></div>
      </EqualizerMock>
    );

    jest.runAllTimers();

    setTimeout(() => {
      var el = ReactDOM.findDOMNode(element);

      for (var i=0; i < el.children.length; i++) {
        var childNode = el.children[i];
        expect(childNode.style.height).toEqual(baseHeight);
      }

      done()
    }, 2)
  })

  it('sets children heights to the tallest child in any row when byrow is disabled', (done) => {
    var maxHeight  = '102px';
    var baseHeight = '100px';

    var EqualizerMock = generateEqualizerMock(
      (node) => {
        return +node.getAttribute('data-row')
      },
      (node) => {
        var prevRow = node.previousElementSibling ? +node.previousElementSibling.getAttribute('data-row') : 0
        var curRow  = +node.getAttribute('data-row')

        if(prevRow === curRow) {
          return (+baseHeight) - 10
        } else {
          return (+baseHeight) + curRow
        }
      }
    )

    var element = TestUtils.renderIntoDocument(
      <EqualizerMock>
        <div data-row={1}></div>
        <div data-row={1}></div>
        <div data-row={1}></div>
        <div data-row={2}></div>
        <div data-row={2}></div>
        <div data-row={2}></div>
      </EqualizerMock>
    );

    jest.runAllTimers();

    setTimeout(() => {
      var el = ReactDOM.findDOMNode(element);

      for (var i=0; i < el.children.length; i++) {
        var childNode = el.children[i];
        expect(childNode.style.height).toEqual(maxHeight);
      }

      done()
    }, 2)
  })
})