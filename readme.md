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

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th width="30%">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>className</code>
      </td>
      <td>
        <code>[empty]</code>
      </td>
      <td>
        Class of the equalizer container
      </td>
    </tr>
    <tr>
      <td>
        <code>property</code>
      </td>
      <td>
        <code>height</code>
      </td>
      <td>
        The style property used when setting height. Usually <code>height</code>, <code>maxHeight</code> or <code>minHeight</code>.
      </td>
    </tr>
    <tr>
      <td>
        <code>byRow</code>
      </td>
      <td>
        <code>true</code>
      </td>
      <td>
        By default Equalizer will attempt to take into account stacking by matching rows by their window offset.
      </td>
    </tr>
    <tr>
      <td>
        <code>enabled</code>
      </td>
      <td>
        <code>(component, node) =&gt; true</code>
      </td>
      <td>
        Takes a function that returns <code>true</code> or <code>false</code> and can be used to disable Equalizer. Useful if you want to disable Equalizer when something changes such as window width or height based on a media query..
      </td>
    </tr>
    <tr>
      <td>
        <code>nodes</code>
      </td>
      <td>
        <pre><code>(component, node) =&gt;
  node.children</code></pre>
      </td>
      <td>
        Function which returns nodes to equalize. By default Equalizer only measures the heights of its direct descendants.
      </td>
    </tr>
  </tbody>
</table>

### Simple example with options

```jsx
<Equalizer
  byRow={false}
  property="maxHeight"
  enabled={() => window.matchMedia("(min-width: 400px)").matches}>
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

### Demo

http://jsbin.com/vaheha/edit?js,output

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
