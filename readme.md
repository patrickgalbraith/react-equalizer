![Build Status](https://api.travis-ci.org/patrickgalbraith/react-equalizer.svg)

# React Equalizer

Pure React component which equalizes heights of components.

## Installation

```
npm install --save react-equalizer
```

## Usage

This is a basic example which equalizes height of child components.

```jsx
<Equalizer>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</Equalizer>
```

### Options

| Prop       | Default                              | Description                                                                                                                                                                                                  |
|------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `property` | `height`                             | The style property used when setting height. Usually `height`, `maxHeight` or `minHeight`.                                                                                                                   |
| `byRow`    | `true`                               | By default Equalizer will attempt to take into account stacking by matching rows by their window offset.                                                                                                     |
| `enabled`  | `(component, node) => true`          | Takes a function that returns `true` or `false` and can be used to disable Equalizer. Useful if you want to disable Equalizer when something changes such as window width or height based on a media query.. |
| `nodes`    | `(component, node) => node.children` | Function which returns nodes to equalize. By default Equalizer only measures the heights of its direct descendants.                                                                                          |

### Simple example with options

```jsx
<Equalizer
  byRow={false}
  property="maxHeight"
  enabled={(node) => window.matchMedia("(min-width: 400px)").matches}>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</Equalizer>
```

### Specifying nodes example

This can be useful if you want to equalize components other than direct descendants.

```jsx
class MyComponent extends Component {
  getNodes(equalizerComponent, equalizerElement) {
    return = [
      this.refs.node1,
      this.refs.node2,
      this.refs.node3
    ]
  }

  render() {
    return(
      <Equalizer nodes={this.getNodes.bind(this)}>
        <div ref="node1"></div>
        <div>
          <div ref="node2"></div>
        </div>
        <div ref="node3"></div>
      </Equalizer>
    )
  }
}
```

## Running Tests

Grab the latest source and in the project directory run:

```
npm install
npm test
```

## Roadmap

* Add support for setting height of Equalizer component based on total height of children. This will be useful if children are positioned absolutely and the container needs to have a fixed height.

## References
* Zurb Foundation Equalizer
* jQuery Match Height
