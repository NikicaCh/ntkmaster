import React from 'react'
import firebase from 'firebase'

import SignIn from './Sign-in'


class Home extends React.Component {

    componentDidMount() {
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
             const userObj = {
                displayName : user.displayName,
                email : user.email,
                emailVerified : user.emailVerified,
                photoURL : user.photoURL,
                isAnonymous : user.isAnonymous,
                uid : user.uid,
                providerData : user.providerData
             }
             console.log(userObj)
    
              // User is signed in.
              
            } else {
              // User is signed out.
              // ...
            }
          });
    }

    render() {
        return( 
            <div className="Home">

                <SignIn />
            </div>
        )
    }
}



export default Home;