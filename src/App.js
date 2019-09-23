import React from 'react'
import './App.css'
import { Route, Switch, BrowserRouter } from "react-router-dom"
import Home from './components/Home'
import Season from './components/Season'
import Articles from './components/Articles'


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null
    }
  }

  componentDidMount = () => {
    

  }

  render() {
    return(
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/season" component={Season} />
            <Route exact path="/articles" component={Articles} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

}

export default App;
