import React from 'react';
import './App.css';
import firebase from 'firebase'


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null
    }
  }

  componentDidMount = () => {
    let state = [];
    firebase
      .firestore()
      .collection("articles")
      .onSnapshot(serverUpdate => {
        state = [];
        const data = serverUpdate.docs.map(_docs => {
          const d = _docs.data();
          return d;
        })
        data.map(_data => {
          const el = 
            <div>
              <h3>{_data.id}</h3>
              <h3>{_data.name}</h3>
              <h3>{_data.quantity}</h3>
            </div>
          
          state.push(el)
        })
        this.setState({data: state})
        console.log(data)
      })
  }

  render() {
    return(
      <div>{this.state.data}</div>
    )
  }

}

export default App;
