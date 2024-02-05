import React from "react";
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component

const About = () => {
    const photo = 'flowchart.png';
    return (
    
        <div>

            <NavigationBar></NavigationBar>
            <p>Henry Kendall, Justin Szaday, Sophie Liu, and Rujun Gao </p>
            <p>Engineering hour = 20 hrs</p>
            <div className="main-content">
            <img
              src={photo}
              alt="Random Photo"
              className="photo-Y"
            />
            </div>
        </div>
    );
};
 
export default About;