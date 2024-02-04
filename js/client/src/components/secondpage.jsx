import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import './../MapComponent.css'; // Create a CSS file for styling
//import { GoogleApiWrapper, GoogleMapReact } from 'google-maps-react';
import React, { Component} from 'react';
import './../App.css'; // Create a CSS file for styling
import { Map, GoogleApiWrapper, Marker, Polygon} from 'google-maps-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import ThirdPage from "./thirdpage.jsx";
//import axios from 'axios';
//import { DrawShape } from 'react-draw-shape';
const apiKey = 'AIzaSyCQEjBzl2MSx3l7rvE6aTOGkJGaQBUzQvI';

class SecondPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '', // Store user-entered address
      coordinates: null, // Store coordinates of the address
      drawingMode: false,
      drawingRectangle: null,
    };
  }


    // Function to start drawing mode
    startDrawing = () => {
      this.setState({ drawingMode: true });
    };
  
    // Function to end drawing mode
    stopDrawing = () => {
      this.setState({ drawingMode: false });
      if (this.state.drawingRectangle) {
        this.state.drawingRectangle.setMap(null); // Clear previous rectangle
      }
    };
  
    // Event listener to handle map click
    handleMapClick = (mapProps, map, clickEvent) => {
      if (this.state.drawingMode) {
        const { google } = this.props;
        const { LatLngBounds, LatLng } = google.maps;
        const bounds = new LatLngBounds(
          new LatLng(clickEvent.latLng.lat(), this.map.map.getBounds().getSouth()),
          new LatLng(this.map.map.map.getBounds().getNorth(), clickEvent.latLng.lng())
        );
  
        if (this.state.drawingRectangle) {
          this.state.drawingRectangle.setMap(null); // Clear previous rectangle
        }
  
        // Create a new rectangle
        const drawingRectangle = new google.maps.Rectangle({
          map: map,
          bounds: bounds,
          editable: true, // Allow the user to resize and move the rectangle
          draggable: true,
          strokeColor: 'red', // Set the bounding box color to red
        });
  
        this.setState({ drawingRectangle });
      }
    };

  handleAddressChange = (event) => {
    this.setState({ address: event.target.value });
  };

  // Handle the button click to zoom to the entered address
  zoomToLocation = async () => {
    // Use the Google Maps API geocoder to convert the address to coordinates
    const { google } = this.props;
    const { address } = this.state;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;

        this.setState({ coordinates: location });
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(location.lat() - 0.001, location.lng() - 0.001)); // Adjust the buffer as needed
        bounds.extend(new google.maps.LatLng(location.lat() + 0.001, location.lng() + 0.001)); // Adjust the buffer as needed

        // Set the map's center to the coordinates of the address
        this.map.map.setCenter(location);
        this.map.map.setZoom(20);

        this.map.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          document.getElementById("info"),
        );
      } else {
        console.error('Geocode was not successful for the following reason:', status);
     }
    });

  };

  render() {
  
    const pageStyles = {
      position: 'relative', // Add position relative to the page container
      width: '100vw', // Full viewport width
      height: '100vh', // Full viewport height
    };

    const mapStyles = {
      position: 'absolute', // Set the map to absolute position
      //top: 0, // Align to the top of the page
      left: 0, // Align to the left of the page
      width: '100%', // Full width
      height: '100%', // Full height
      opacity: 0.8, /* Adjust the opacity value as needed */
      zindex: -1, /* Place the map behind other elements */
    };
    const { coordinates, address, bounds } = this.state;
    
    return (
      <div>
        <NavigationBar></NavigationBar>
        <div className="user-input">
          {/* User input for zip code */}
          <input
            type="text"
            placeholder="Enter a street address"
            value={address}
            onChange={this.handleAddressChange}
          />
          <button onClick={this.zoomToLocation}>Zoom to Address</button>
          <Link to="/ThirdPage"><button>...</button></Link>
         {/* <button onClick={this.stopDrawing}>Stop Drawing</button> */}
        </div>
        <div style = {mapStyles}>

            <Map
                google={this.props.google}
                zoom={14}
                style={mapStyles}
                initialCenter={{
                  lat: 37.275359, // Latitude of Saratoga, CA
                  lng: -122.017788, // Longitude of Saratoga, CA
                }}
                onClick={this.handleMapClick}
                center={coordinates} // Center the map on the coordinates
                bounds={bounds} // Set the bounds for the boundin
                ref={(map) => (this.map = map)}>
            </Map>

        </div>

      </div>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyCQEjBzl2MSx3l7rvE6aTOGkJGaQBUzQvI', // Replace with your Google Maps API key
})(SecondPage);