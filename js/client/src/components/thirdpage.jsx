import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import React, { useState, useEffect} from 'react';
import toast, { Toaster } from "react-hot-toast";
import './../App.css'; // Create a CSS file for styling
import io from 'socket.io-client';

function ThirdPage() {
    const photo1 = '14219.png';
    const photo2 = '14219_mask.png';
    const [textLines, setTextLines] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImage1Visible, setIsImage1Visible] = useState(true);
    const [layouts, setLayouts] = useState([]);

    const appendLayout = (layout) => {
        setLayouts(layouts + [layout]);
    };

    const appendTextLine = (line) => {
        //toast(line);
        if (line.includes('Agent') || line.includes('GPT-4V')) {
            setTextLines(prevLines => [...prevLines, line]);
        }
    };

    useEffect(() => {
        const socket = io('ws://127.0.0.1:5000');

        socket.on('info', appendTextLine);

        socket.on('layout', appendLayout);

        socket.emit('message', {address: '14219 Okanogan Dr, Saratoga, CA 95070'});

        return () => {
            socket.disconnect();
          };
    }, []);

    const toggleImage = () => {
      setIsImage1Visible(!isImage1Visible);
    };

        return (

            <div>
            <Toaster/>
            <NavigationBar></NavigationBar>

                <div className="main-content">
                    <div className="left-column">
                        <div className="b">
                            <div class="scrollable-column">
                            <h1>Server Messages:</h1>
                            {/* display messages from server*/}
                            {textLines.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                            </div>
                        </div>
                    
                    </div>

                    <div className="column right-column">
                    <div className="user-input">
                        <button onClick={toggleImage}>Output analysis</button>
                                {isImage1Visible ? (
                                <img src={photo2} alt={photo2} />
                                ) : (
                                <img src={photo1} alt={photo1} />
                                )}
                    </div>
                    </div>
                </div>
            </div>
        );
 }
 export default ThirdPage;