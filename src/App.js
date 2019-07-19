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
      backswing: [],
      topswing: 0,
      downswing: [],
      swingState: -2,
      paceCounter: 0,
      intervalId: 0,
      isBackswingDeltaPostive: false
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
      if (state.paceCounter < 50) {
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
      backswing: [],
      topswing: 0,
      downswing: [],
      swingState: 0,
      paceCounter: 0,
      intervalId: 0,
      isBackswingDeltaPostive: false
    })
  }
  handleScroll = (e) => {
    console.log('------------------')
    const thisDir = 0 < e.deltaY
    console.log(thisDir)
    if (this.state.swingState === 0) {
      this.startSwing()
    }
   console.log(e.deltaY)
    this.setState((state) => {
      switch (state.swingState) {
        case 0: //triggers backswing //existing state had not experienced mosewheel movement until now, 
             return {
               swingState: 1,
               paceCounter: 0,
               isBackswingDeltaPostive: thisDir
             }
        case 1: //backswing in progress
        case 2: //antiquated
          console.log('backswing in progress')
          return thisDir === state.isBackswingDeltaPostive ?
            {
              backswing: state.backswing.slice(0, state.backswing.length).concat([state.paceCounter]),
              paceCounter: 0,
            } :
            {
              topswing: state.paceCounter,
              swingState: 3,
              paceCounter: 0,
             }
        case 3: //downswing in progress
          console.log('downswing in progress')
             return {
              downswing: state.downswing.slice(0, state.downswing.length).concat([state.paceCounter]),
              paceCounter: 0,
          }
        default: //swing complete, kick back to ball in hand
          console.log('swing complete, kick back to ball in hand')
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
        return 'x             x'
      case -1:
        return Math.max(60 - this.state.backswing.length, (95 + this.state.downswing.length) - (Math.abs(this.state.topswing - 50)/2))
          + " | "
          + (this.state.backswing.reduce((a, b) => a + b, 0) - this.state.downswing.reduce((a, b) => a + b, 0))
          + " | "
          + (this.state.backswing.length - this.state.downswing.length)
      default:
        return this.state.paceCounter;
    }
  }
  render() {
    
    
    return (
    <div className="course" >
      <div>
        <div>
          {this.state.backswing.map((n, index) => {
            return <h6 className="detailText" key={index}>{n}</h6>
          })}
        </div>
        <div>
          <div >
              <h3 className="flankHeading">{this.state.backswing.reduce((a, b) => a + b, 0)}</h3>
          </div>
          <div>
              <h2 className="centerHeading"> {this.state.topswing}</h2>
          </div>
          <div>
              <h3 className="flankHeading">{this.state.downswing.reduce((a, b) => a + b, 0)}</h3>
          </div>
        </div>
        <div>
          {this.state.downswing.map((n, index) => {
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
