import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import React, { useState, useEffect} from 'react';
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from 'react-tooltip';
import './../App.css'; // Create a CSS file for styling
import io from 'socket.io-client';

function ThirdPage() {
    const photos = ['14219.png', '14219_mask.png', 'adu_bounds.png'];
    const [textLines, setTextLines] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleImage, setVisibleImage] = useState(0);
    const [layouts, setLayouts] = useState([]);

    const appendLayout = (layout) => {
        setLayouts(prevLayouts => [...prevLayouts, layout]);
    };

    const appendTextLine = (line) => {
        if (line.includes('Agent') || line.includes('GPT-4V')) {
            setTextLines(prevLines => [...prevLines, line]);
        }
    };

    useEffect(() => {
        const socket = io('ws://127.0.0.1:5000');

        socket.on('info', appendTextLine);

        socket.on('layout', layout => appendLayout(layout));

        socket.emit('message', {address: '14219 Okanogan Dr, Saratoga, CA 95070'});

        return () => {
            socket.disconnect();
          };
    }, []);

    const toggleImage = () => {
      setVisibleImage((visibleImage + 1) % 3);
    };

    const getOverlay = () => {
        const layout = layouts[currentIndex];
        const scale  = layout.scale; 
        return (
            <div>
            <a  href={layout.linkToBuilder}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-id="my-tooltip-data-html"
                data-tooltip-html={`<img src="Floorplans_cropped/${layout.layoutImage}" />`}
            >
            <img src={`Floorplans_cropped/${layout.layoutImage}`} className="overlay-image" style={{transform: `scale(${scale}, ${scale})`}}/>
            </a>
            <Tooltip id="my-tooltip-data-html" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#FFFFFF" }} />
            </div>
        );
    };

    const goLeft = () => {
        setCurrentIndex(currentIndex ? currentIndex - 1 : (layouts.length - 1));
    };

    const goRight = () => {
        setCurrentIndex((currentIndex + 1) % layouts.length);
    };

        return (

            <div>
            <Toaster/>
            <NavigationBar></NavigationBar>

                <div className="main-content">
                    <div className="left-column">
                        <div className="b">
                            <div class="scrollable-column">
                            <h1>Start city code and build analysis ...</h1>
                            {/* display messages from server*/}
                            {textLines.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                            </div>
                        </div>
                    
                    </div>

                    <div className="column right-column">
                    <div className="user-input">
                        <div>
                        {
                            (layouts.length > 0 && visibleImage == 2) ? <button onClick={goLeft}>&lt;&lt;</button> : <div></div>
                        }
                        <button onClick={toggleImage}>Output analysis</button>
                        {
                            (layouts.length > 0 && visibleImage == 2) ? <button onClick={goRight}>&gt;&gt;</button> : <div></div>
                        }
                        </div>
                        <div>
                        <img src={photos[visibleImage]} alt={photos[visibleImage]} className="base-image" />
                        {
                            (layouts.length > 0 && visibleImage == 2) ? getOverlay() : <img className="overlay-image" />
                        }
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
 }
 export default ThirdPage;