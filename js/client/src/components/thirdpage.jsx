import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import React, { Component} from 'react';
import './../App.css'; // Create a CSS file for styling

function ThirdPage() {
    const photo = 'hello.jpg';
        return (

            <div>
        
            <NavigationBar></NavigationBar>
                <div className="three-columns-container">
                    <div className="column">
                        
                        <img src={photo} className="photo-panel"/>
                        Column 1
                    </div>

                    <div className="column">
                        <img src={photo} className="photo-panel"/>
                        Column 2
                    </div>
                    <div className="column">
                        <img src={photo} className="photo-panel"/>
                        Column 3
                    </div>
                </div>

            </div>
            
        );
    
 }
 export default ThirdPage;