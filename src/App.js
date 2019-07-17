import React from 'react';
import './App.css';
//import moment from "moment";

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
      wheelMovements: {
        backswing: [],
        topswing: 0,
        downswing: [],
      },
      swingState: 0,
      paceCounter: 0,
      intervalId: 0,
    }
  }

  startSwing = () => {
    clearInterval(this.state.intervalId)
    const newId = setInterval(() => this.paceTick, 1)
    this.setState({
      intervalId: newId
    }) 
  }
  endSwing = () => {
    clearInterval(this.state.intervalId)
  }
  paceTick = () => {
    this.setState((state) => {
      return (state.swingState !== 0 || state.swingState !== 2) && state.paceCounter > 100 ?
        { paceCounter: 0, swingState: state.swingState + 1, } :
        { paceCounter: state.paceCounter + 1} 
    })
  }
  
  handleClick() {
    this.setState({
      swingState: 0,
      paceCounter: 0,
    })
  }
  handleScroll = (e) => {
    console.log(this.state)
    if (this.state.swingState === 0) {
      this.startSwing()
    }
    // const { deltaY, type } = e
    this.setState((state) => {
      switch (state.swingState) {
        case 0: //triggers backswing //existing state had not experienced mosewheel movement until now, 
             return {
               swingState: 1,
               paceCounter: 0,
             }
           case 1: //backswing in progress
             return {
              wheelMovements: {
                 backswing: state.wheelMovements.backswing.slice(0, state.wheelMovements.backswing.length).concat([state.paceCounter])
               },
             }
           case 2: //triggers downswing //existing state had been holding at topswing, 
             return {
               wheelMovements: {
                 topswing: state.paceCounter,
                 swingState: 3,
                 paceCounter: 0,
               },
             }
           case 3: //downswing in progress
             return {
               wheelMovements: {
                 foreswing: state.wheelMovements.foreswing.slice(0, state.wheelMovements.foreswing.length).concat([state.paceCounter])
               },
               paceCounter: 0,
             }
        default: //swing complete, kick back to ball in hand
             this.endSwing()
             return {
              swingState: -1,
              paceCounter: 0,
             }
         }
      })
  }

  render() {
    console.log(this.state.wheelMovements[this.state.wheelMovements.length - 1])
    return this.state.swingState > 0 ?
      (
        <button onWheel={this.handleScroll}>
          <h1>{this.state.paceCounter}</h1>
        </button>
      )
        :
      (
      <button onWheel={this.handleScroll}>
        <h1>x                  x</h1>
      </button>
    );
  }
}
