import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Destructuring :
// var user = {name: "abcd", age: 22};
// var {name, age} = user;
// console.log(name, age);
// var { name : Name, age: Age } = user;
// console.log(Name, Age);

// Spread Operator :
// var [a, b, ...rest] = [1, 2, 3, 4];
// console.log(a, b);
// console.log(rest);

// Passing an obj as a function's parameters
// const { component, path} = parameters;
// console.log(component, path);

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}

export default PrivateRoute;
