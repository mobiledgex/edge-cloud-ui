import React from 'react';
//tween
import {TweenMax, TimelineMax, Power2} from 'gsap';
import GSAP from 'react-gsap-enhancer';

function createAnim(object) {
  var box = object.target;
  // return new TimelineMax({repeat: -1})
  //   .to(box, 1, {scale: 1.23, y: '+=120'})
  //   .to(box, 1, {scale: 1, y: '-=120'})
  //   .to(box, 1, {rotation: 90}, 1)

    return TweenMax.fromTo(box, 0.8, object.options.option_from, object.options.option_to);
}

const MakeFadesUp = (Component, options = { duration: 0.3 }) => {
    return GSAP()(class FadesUp extends React.Component {
        constructor(props) {
            super(props)
            this.state = {x: 0, y: 0, mounted: false}
        }
        componentDidMount(callback) {

        }
        componentWillEnter (callback) {
            this.addAnimation(createAnim, {option_from:{y: 100, opacity: 0}, option_to:{y: 0, opacity: 1, onComplete: callback}});
        }

        componentWillLeave (callback) {
            this.addAnimation(createAnim, {option_from:{y: 0, opacity: 1}, option_to:{y: -100, opacity: 0, onComplete: callback}})
        }

        render () {
            console.log('state mounted -- '+this.state.mounted)
            return <Component ref={ref => this.container = ref} />;
        }
})
}
export default MakeFadesUp
