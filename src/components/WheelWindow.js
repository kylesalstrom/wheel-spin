import React from 'react';

export class WheelWindow extends React.Component {
    componentDidMoun() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // handleScroll: function(event) {
    //     let scrollTop = event.srcElement.body.scrollTop,
    //         itemTranslate = Math.min(0, scrollTop / 3 - 60);

    //     this.setState({
    //         transform: itemTranslate
    //     });

    handleScroll = (e) => {
        console.log('spin right round');
        console.log(e);
    }

    render() {
        return (
            <button onWheel={this.handleScroll}>
                <h1>Hello, world!</h1>
            </button>
        );
    }
}

export default WheelWindow