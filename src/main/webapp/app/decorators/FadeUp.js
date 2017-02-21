import React from 'react';
import TweenMax from 'gsap/src/uncompressed/TweenMax';

const fadeUp = (Component) =>
  class FadeUp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        className: 'panel panel-default'
      };
    }

    componentWillAppear(callback) {
      TweenMax.fromTo(this.node, 0.6, { opacity: 0.01 }, { opacity: 1, ease: Power1.easeIn, onComplete: callback });
    }

    componentWillEnter(callback) {
      this.setState({
        className: 'panel panel-danger'
      });
      TweenMax.fromTo(this.node, 0.6, { opacity: 0.01 }, { opacity: 1, ease: Power1.easeIn, onComplete: callback });
    }

    componentDidEnter() {
      setTimeout(() => {
        this.setState({
          className: 'panel panel-default'
        });
      }, 5000);
    }

    componentWillLeave(callback) {
      TweenMax.fromTo(this.node, 0.6, { opacity: 1 }, { opacity: 0.01, onComplete: callback });
    }

    render() {
      return (
        <Component ref={node => this.node = node} {...this.props} className={this.state.className}/>
      );
    }
  };

export default fadeUp;
