import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FirebaseOptions, getApp, initializeApp } from "@firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_WGC4Txfi96hl-DHjBmQAETz1THPJNtQ",
  authDomain: "fluid-dynamics-e684a.firebaseapp.com",
  databaseURL: "https://fluid-dynamics-e684a.firebaseio.com",
  projectId: "fluid-dynamics-e684a",
  storageBucket: "fluid-dynamics-e684a.appspot.com",
  messagingSenderId: "284033470785",
  appId: "1:284033470785:web:686b138f29b5999b48d1c0",
  measurementId: "G-6YZL7DF2ZK"
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);
const provider = new GoogleAuthProvider();

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // s3URL = await axios.get('http://54.219.221.121:8080/s3Url')
  
  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setIsLoggedIn(true)
        console.log('Debug Lloyd :: ', user);
      } else {
        // No user is signed in.
        setIsLoggedIn(false)
        console.log('Debug FIddy :: ', user);
      }
    });
  }, [])

  const login = () => {
    const auth = getAuth();
    if(!auth.currentUser) {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } else {
    }
  }

  const logout = () => {
    const auth = getAuth();
    auth.signOut()
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          isLoggedIn ? (
            <>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={login}>Login</button>
          )
        }
      </header>
    </div>
  );
}

export default App;
