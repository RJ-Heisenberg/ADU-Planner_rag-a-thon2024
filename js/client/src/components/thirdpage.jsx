import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import React, { useState, useEffect} from 'react';
import './../App.css'; // Create a CSS file for styling

function ThirdPage() {
    const photo1 = '14219.png';
    const photo2 = '14219_mask.png';
    const [textLines, setTextLines] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImage1Visible, setIsImage1Visible] = useState(true);

    useEffect(() => {
        // Load text content from a file or API when the component mounts
        fetch('your-text-file.txt')
          .then((response) => response.text())
          .then((data) => {
            const lines = data.split('\n'); // Split text into lines
            setTextLines(lines);
          })
          .catch((error) => {
            console.error('Error fetching text:', error);
          });
      }, []);
    
      const handleNextClick = () => {
        if (currentIndex < textLines.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      };

    const toggleImage = () => {
      setIsImage1Visible(!isImage1Visible);
    };

        return (

            <div>
        
            <NavigationBar></NavigationBar>
                <div className="three-columns-container">
                    <div className="column">
                        <img src={photo2} className="photo-panel"/>
                        Column 1
                    </div>

                    <div className="column">
                        <div className="user-input">
                        <button onClick={toggleImage}>Next</button>
                            <div className="image-container">
                                {isImage1Visible ? (
                                <img src={photo2} alt={photo2} />
                                ) : (
                                <img src={photo1} alt={photo1} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="column">

                        <div className="text-stream-dialog">
                        <div className="text-area">
                            {textLines[currentIndex]}
                        </div>
                        <button onClick={handleNextClick}>Next</button>
                        </div>

                        Column 3
                    </div>
                </div>

            </div>
            
        );
    
 }
 export default ThirdPage;