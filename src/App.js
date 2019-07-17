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
      if (state.paceCounter < 100) {
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

  render() {
    const button = this.state.swingState >= 0 ?
      (
        <button className="bottomButton" onWheel={this.handleScroll}>
          <h1>{this.state.paceCounter}</h1>
        </button>
      )
      :
      (
        <button className="bottomButton" onWheel={this.handleScroll} onClick={this.handleClick}>
          <h1>x                  x</h1>
        </button>
      );
    const display = this.state.swingState === -1 ?
      (
        <div>
        <div>
          <ol>
            {this.state.wheelMovements.backswing.map((n, index) => {
              return <li key={index}>{n}</li>
            })}
          </ol>
          </div>
          <div>
            <h1> {this.state.wheelMovements.topswing}</h1>
          </div>
        <div>
          <ol>
            {this.state.wheelMovements.downswing.map((n, index) => {
              return <li key={index}>{n}</li>
            })}
          </ol>
          </div>
        </div>
      )
      :
      (
          <h1>{'go!'}</h1>
      );
    
    return <div className="course" >{display}{button}</div>
  }
}
