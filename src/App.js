import React from 'react'
import './App.css'
import firebase from 'firebase'
import { Route, Switch, BrowserRouter } from "react-router-dom"
import Home from './components/Home'
import Season from './components/Season'


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null
    }
  }

  componentDidMount = () => {
    let state = [];
    
    // firebase
    //   .firestore()
    //   .collection("articles")
    //   .onSnapshot(serverUpdate => {
    //     state = [];
    //     const data = serverUpdate.docs.map(_docs => {
    //       const d = _docs.data();
    //       return d;
    //     })
    //     data.map(_data => {
    //       const el = 
    //         <div>
    //           <h3>{_data.id}</h3>
    //           <h3>{_data.name}</h3>
    //           <h3>{_data.quantity}</h3>
    //         </div>
          
    //       state.push(el)
    //     })
    //     this.setState({data: state})
    //     console.log(data)
    //   })

  }

  componentWillUnmount() {
    firebase.auth.getInstance().signOut();

  }

  render() {
    return(
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/season" component={Season} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

}

export default App;
