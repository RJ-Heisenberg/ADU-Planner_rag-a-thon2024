// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

  // export default App;
  import React, { useState, useEffect } from 'react';
  import './App.css';
  import NavigationBar from './navigationbar.js';
  
  function Home() {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const photos = ['youtube2.jpg', 'youtube3.jpg'];
  
    useEffect(() => {
      // Automatically switch photos every 3 seconds
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 3000);
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return (
  
      <div className="Home">
  
  
        {/* Navigation Bar */}
        <NavigationBar></NavigationBar>
  
        {/* Main Content */}
        <div className="main-content">
  
  
          <div className="left-column">
            <div className="title">
              Rally
            </div>
            <div className="button-container">
              <button className="left-button">
                <span className="icon">Click</span>
                <div className="button-text">Follower Login</div>
              </button>
              <button className="right-button">
                <span className="icon">Click</span>
                <div className="button-text">Producer Login</div>
              </button>
            </div>
          </div>
  
  
          <div className="column right-column">
            <img
              src={photos[currentPhotoIndex]}
              alt="Random Photo"
              className="photo-panel"
            />
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;