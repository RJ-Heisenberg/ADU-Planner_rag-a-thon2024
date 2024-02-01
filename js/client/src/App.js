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

// importing components from react-router-dom package
//https://www.geeksforgeeks.org/how-to-redirect-to-another-page-in-reactjs/

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import About component
import { Link } from 'react-router-dom';
import SecondPage from "./components/secondpage.jsx";
import Home from "./login.js"
import './App.css';
import NavigationBar from './navigationbar.js';
import About from "./components/firstpage.jsx";

function App() {

//https://www.geeksforgeeks.org/how-to-redirect-to-another-page-in-reactjs/
return (<>
    <Router>
        <Routes>
            {/* This route is for home component 
  with exact path "/", in component props 
  we passes the imported component*/}
            <Route
                exact
                path="/"
                element={<Home />}
            />
            <Route
                exact
                path="SecondPage"
                element={<SecondPage />}
            />
            <Route
                exact
                path="About"
                element={<About />}
            />
        </Routes>
    </Router>
</>)


  //https://medium.com/@muhammedbalkaya/to-enable-page-navigation-between-components-in-a-react-project-the-commonly-used-approach-is-to-b75594ec2460
  // return (
  //   <div>
  //     <Route path="/" exact component={HomePage} />
  //     <Route path="/secondpage" component={SecondPage} />
  //   </div>
  // );

  // return (

  //   <div className="App">


  //     {/* Navigation Bar */}
  //     <NavigationBar></NavigationBar>

  //     {/* Main Content */}
  //     <div className="main-content">


  //       <div className="left-column">
  //         <div className="title">
  //           Rally
  //         </div>
  //         <div className="button-container">
  //           <button className="left-button">
  //             <span className="icon">Click</span>
  //             <div className="button-text">Follower Login</div>
  //           </button>
  //           <button className="right-button">
  //             <span className="icon">Click</span>
  //             <div className="button-text">Producer Login</div>
  //           </button>
  //         </div>
  //       </div>


  //       <div className="column right-column">
  //         <img
  //           src={photos[currentPhotoIndex]}
  //           alt="Random Photo"
  //           className="photo-panel"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default App;