import React, { useContext, useState, useEffect } from "react";
import { auth, provider } from "../firebase/firebase";

const AuthContext = React.createContext();

// Using this our own useContext() we can get all the values specified in it.
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // Getting currently signed in user.
  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false); // Whenever we have a user we are done loading
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function signInWithGoogle() {
    return auth.signInWithPopup(provider);
  }

  const values = {
    currentUser,
    signUp,
    login,
    logout,
    signInWithGoogle,
  };

  //    We are returning all the values inside
  //    the VALUES object using <AuthContext.Provider/> to use it anywhere in our application.
  return (
    <AuthContext.Provider value={values}>
      {/* {children} */}
      {/* Dont render any value until we have currentUser is being set at very first time */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
