import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <div className="header-container">
          <h1>WEB CLASSROOM</h1>
        </div>
        <div className="button-container">
          <button>Sign In With Google</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
