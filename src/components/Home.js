import React from "react";
import { app } from "../firebase.tsx";
import { auth } from "firebase";
// import { getAuth } from "firebase/auth";

import SignIn from "./Sign-in";

// let auth = getAuth(app);

class Home extends React.Component {
  componentDidMount() {
    auth().onAuthStateChanged(function (user) {
      if (user) {
        const userObj = {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          providerData: user.providerData,
        };
        console.log(userObj);
        // User is signed in.
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  render() {
    return (
      <div className="Home">
        <SignIn />
      </div>
    );
  }
}

export default Home;
