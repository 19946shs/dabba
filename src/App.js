import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
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
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);
  
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = [...e.dataTransfer.files]
      axios.get('http://54.219.221.121:8080/s3Url')
      .then((resp) => {
          const s3URL = resp.data.url
          console.log('Debug FIddy :: ', files, s3URL);
          if(files.length) {
            axios.put(s3URL, files, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
          }
        })
    }
  };
  
  // triggers when file is selected with click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log('Debug FIddy :: ', e.target.files);
          // handleFiles(e.target.files);
    }
  };
  
// triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  
  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setIsLoggedIn(true)
        console.log('Debug Lloyd :: ', user);
      } else {
        // No user is signed in.
        setIsLoggedIn(false)
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
              <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                  <div>
                    <p>Drag and drop your file here or</p>
                    <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
                  </div> 
                </label>
                { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
              </form>
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
