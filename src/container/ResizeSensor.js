import React from 'react';

let _self = null;
export default class ResizeSensor extends React.PureComponent {
  render() {
    return (
      <iframe
        ref={ref => {
          this.ref = ref;
        }}
        style={{
          border: 'none',
          background: 'transparent',
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: -1,
        }}
      />
    );
  }

  componentDidMount() {
    _self = this;
    this.ref.contentWindow.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    _self = this;
    this.ref.contentWindow.removeEventListener('resize', this._handleResize);
  }

  _handleResize = () => {
    window.requestAnimationFrame(_self.props.onResize);
  };
}
