import React from "react";
import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Season from "./components/Season";
import Articles from "./components/Articles";
import Analytics from "./components/Analytics";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: null,
    };
  }

  componentDidMount = () => {};
  // componentWillUnmount() {
  //   firebase
  //     .auth()
  //     .signOut()
  //     .then(
  //       function () {
  //         // Sign-out successful.
  //       },
  //       function (error) {
  //         // An error happened.
  //       }
  //     );
  // }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/season" component={() => <Season />} />

            <Route exact path="/articles" component={Articles} />
            <Route exact path="/analytics" component={() => <Analytics />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
