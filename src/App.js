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
      swingState: -2,
      paceCounter: 0,
      intervalId: 0,
    }
  }

  startSwing = () => {
    clearInterval(this.state.intervalId)
    const newId = setInterval(() => this.paceTick(), 1)
    this.setState({
      intervalId: newId
    }) 
  }
  endSwing = () => {
    clearInterval(this.state.intervalId)
  }
  paceTick = () => {
    this.setState((state) => {
      if (state.paceCounter < 20) {
        return { paceCounter: state.paceCounter + 1 } 
      }
      else {
        switch (state.swingState) {
          case 1:
            return { paceCounter: state.paceCounter + 1 , swingState: 2, }
          case 2:
            return { paceCounter: state.paceCounter + 1 } 
          case 3:
            this.endSwing()
            return { paceCounter: 0, swingState: -1, }
          default:
            break;
        }
      }
    })
  }
  
  handleClick = () => {
    this.setState({
      wheelMovements: {
        backswing: [],
        topswing: 0,
        downswing: [],
      },
      swingState: 0,
      paceCounter: 0,
      intervalId: 0,
    })
  }
  handleScroll = (e) => {
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
                 backswing: state.wheelMovements.backswing.slice(0, state.wheelMovements.backswing.length).concat([state.paceCounter]),
                 topswing: state.wheelMovements.topswing,
                 downswing: state.wheelMovements.downswing,
               },
               paceCounter: 0,
             }
           case 2: //triggers downswing //existing state had been holding at topswing, 
             return {
               wheelMovements: {
                 backswing: state.wheelMovements.backswing,
                 topswing: state.paceCounter,
                 downswing: state.wheelMovements.downswing,
               },
               swingState: 3,
               paceCounter: 0,
             }
           case 3: //downswing in progress
             return {
               wheelMovements: {
                 backswing: state.wheelMovements.backswing,
                 topswing: state.wheelMovements.topswing,
                 downswing: state.wheelMovements.downswing.slice(0, state.wheelMovements.downswing.length).concat([state.paceCounter])
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

  buttonText = () => {
    switch (this.state.swingState) {
      case -2:
        return 'x               x'
      case -1:
        return Math.max(60 - this.state.wheelMovements.backswing.length, (95 + this.state.wheelMovements.downswing.length) - (Math.abs(this.state.wheelMovements.topswing - 50)/2))
          + " | "
          + (this.state.wheelMovements.backswing.reduce((a, b) => a + b, 0) - this.state.wheelMovements.downswing.reduce((a, b) => a + b, 0))
          + " | "
          + (this.state.wheelMovements.backswing.length - this.state.wheelMovements.downswing.length)
      default:
        return this.state.paceCounter;
    }
  }
  render() {
    
    
    return (
    <div className="course" >
      <div>
        <div>
          {this.state.wheelMovements.backswing.map((n, index) => {
            return <h6 className="detailText" key={index}>{n}</h6>
          })}
        </div>
        <div>
          <div >
              <h3 className="flankHeading">{this.state.wheelMovements.backswing.reduce((a, b) => a + b, 0)}</h3>
          </div>
          <div>
              <h2 className="centerHeading"> {this.state.wheelMovements.topswing}</h2>
          </div>
          <div>
              <h3 className="flankHeading">{this.state.wheelMovements.downswing.reduce((a, b) => a + b, 0)}</h3>
          </div>
        </div>
        <div>
          {this.state.wheelMovements.downswing.map((n, index) => {
            return <h6 className="detailText" key={index}>{n}</h6>
          })}
        </div>
      </div>
        <button className="bottomButton" onWheel={this.handleScroll} onClick={this.handleClick}>
          <h1>{this.buttonText()}</h1>
      </button>
    </div>
    )}
}
