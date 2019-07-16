import React from 'react';
import './App.css';
import moment from "moment";

function App() {
  console.log('lets go')
  return (
    <div className="App">
      <WheelWindow/>
    </div>
  );
}

export default App;




class WheelWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wheelMovements: [],
      swingState: 0
    }
  }

  handleScroll = (e) => {
    const { deltaY, type} = e
    if (type === 'wheel') {
      this.setState((state) => {
        return { wheelMovements: state.wheelMovements.slice(0, state.wheelMovements.length).concat([{ time: moment(), movement: deltaY }]) }
      })
    }
  }

  render() {
    console.log(this.state.wheelMovements[this.state.wheelMovements.length - 1])
    return this.state.wheelMovements && this.state.wheelMovements.length > 0 ?
      (
        <button onWheel={this.handleScroll}>
          <h1>{this.state.wheelMovements[this.state.wheelMovements.length - 1].movement}</h1>
        </button>
      )
        :
      (
      <button onWheel={this.handleScroll}>
        <h1>Hello, world!</h1>
      </button>
    );
  }
}



class timer {

}