import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker, CircleMarker, Popup, useMapEvents } from 'react-leaflet'
import {useRef, useState, useEffect} from 'react';



  function ClickTracker ({setClickedPosition}) {
    useMapEvents({
      click(e){
        setClickedPosition(e.latlng);
      }
    });

    return null;
  }





export default function App() {

  const [coordinates, setCoordinates] = useState([25.1201526, 55.3654066]);
  const [smoothCoordinates, setSmoothCoordinates] = useState([]);
  const [clickedPosition, setClickedPosition ] = useState({lat: 25.1201526, lng: 55.3654066});
  const [initialPosition, setInitialPosition] = useState({lat: 25.1201526, lng: 55.3654066});
  const [roadCoordinates, setRoadCoordinates] = useState([]);


   function smoothCoordinator() {
        let temp = [];
      for(let i = 0; i < roadCoordinates.length; i++){
        if(i < (roadCoordinates.length - 1)){
          const latDifference = (roadCoordinates[i+1][0] - roadCoordinates[i][0])/10;
          const lonDifference = (roadCoordinates[i+1][1] - roadCoordinates[i][1])/10;
          console.log('latDiff: ', latDifference);

        for(let j = 0; j<=10; j++ ){
          const smoothLat = roadCoordinates[i][0] + latDifference*j;
          const smoothLon = roadCoordinates[i][1] + lonDifference*j;
          temp.push({lat: smoothLat, lon: smoothLon});
        }   
      }
   
    }

    setSmoothCoordinates(temp);
  }

  function corLoader(order){
    // console.log("order: ", order);]
    // console.log("smoothCoordinates length: ", smoothCoordinates.length);
    setCoordinates([smoothCoordinates[order].lon, smoothCoordinates[order].lat]);
    // console.log(order);
    // console.log(smoothCoordinates);
  }

  const orderRef = useRef(0);

  useEffect(()=> {

    
      smoothCoordinator();
    

  }, [roadCoordinates])

  useEffect(()=> {
    if(smoothCoordinates.length > 0){
      console.log("interval created!");
      setInterval(() => corLoader(orderRef.current++), 100);
    }
  }, [smoothCoordinates]);


  console.log("Clicked point: ", clickedPosition);
 
  console.log('Road Coordinates: ',roadCoordinates);


  async function postData(data){
    try{
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU1ZDhlNWQ1Yzg3YTRkNTQ5MWZmNzM3MjBmNTc1OGEyIiwiaCI6Im11cm11cjY0In0='
        },

        body: JSON.stringify(data)
      });

      const result = await response.json();
      setRoadCoordinates(result.features[0].geometry.coordinates);
      console.log("Coordinates Uploaded: ", result);



      
    }catch(error){
      console.error('Network or Parsing Error: ', error);
    }
  }


  const points = useRef();

  useEffect(()=> {
    points.current = {
    "coordinates": [
      [54.366669, 24.466667],
      [clickedPosition.lng, clickedPosition.lat]
    ]
  }

  console.log(clickedPosition.lng, clickedPosition.lat);
  }, [clickedPosition])
  

  useEffect(()=> {

    const handleScreenClick = (event) => {
      postData(points.current);
    };

    window.addEventListener('click', handleScreenClick);


    return ()=> {
      window.removeEventListener('click', handleScreenClick);
    };

    // postData(points);
  }, [])


/*
  1) Road Coordinates => Smooth Coordinates generated when page 
      loaded and pushed into 'smoothCoordinates' state =>  interval is created =>
        interval renews the coordinates in the 'coordinates' state

  2) Screen is clicked => 'clickedPosition' state gets the coordinates of click =>




*/










  return(
    <>
      <MapContainer center={[25.1201526, 55.3654066]} zoom={11} scrollWheelZoom={false} style={{ height: "100vh", width: "100%"}} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        <CircleMarker center={coordinates}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </CircleMarker>


     <Marker position={clickedPosition}>
                <Popup>
                    The Coordinates: {clickedPosition.lat}, {clickedPosition.lng}
                </Popup>
      </Marker>
       

        <ClickTracker setClickedPosition={setClickedPosition} />
    </MapContainer>

    </>
    
  )
}