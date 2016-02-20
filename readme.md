![Build Status](https://api.travis-ci.org/patrickgalbraith/react-equalizer.svg)

# React Equalizer

Pure React component which equalizes heights of child components.

### Usage

```jsx
<Equalizer>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</Equalizer>
```

With advanced options:

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

### References
* Zurb Foundation Equalizer
* jQuery Match Height
