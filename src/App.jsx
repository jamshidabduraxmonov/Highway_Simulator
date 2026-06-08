import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Marker, Popup  } from 'react-leaflet'
import {useRef, useState, useEffect} from 'react';

export default function App() {

  const [coordinates, setCoordinates] = useState([25.1201526, 55.3654066]);
  const [smoothCoordinates, setSmoothCoordinates] = useState([]);

  console.log("render");


  let roadCor = [
    { lat: 25.1201526, lon: 55.3654066 },
    { lat: 25.1222283, lon: 55.3683512 },
    { lat: 25.1228725, lon: 55.3692286 },
    { lat: 25.1234919, lon: 55.3700309 },
    { lat: 25.1241277, lon: 55.3708174 },
    { lat: 25.1247798, lon: 55.3715875 },
    { lat: 25.1256564, lon: 55.3725702 },
    { lat: 25.1261310, lon: 55.3730771 },
    { lat: 25.1275952, lon: 55.3745297 },
    { lat: 25.1291602, lon: 55.3759606 },
    { lat: 25.1301559, lon: 55.3767921 },
    { lat: 25.1312000, lon: 55.3776108 },
    { lat: 25.1323923, lon: 55.3784819 },
    { lat: 25.1331742, lon: 55.3790157 },
    { lat: 25.1348814, lon: 55.3801018 },
    { lat: 25.1353365, lon: 55.3803684 },
    { lat: 25.1357951, lon: 55.3806277 },
    { lat: 25.1362570, lon: 55.3808795 },
    { lat: 25.1375924, lon: 55.3815651 },
    { lat: 25.1387585, lon: 55.3821250 },
    { lat: 25.1393608, lon: 55.3824206 },
    { lat: 25.1406942, lon: 55.3830330 },
    { lat: 25.1412447, lon: 55.3832725 },
    { lat: 25.1436020, lon: 55.3842956 },
    { lat: 25.1454957, lon: 55.3851069 },
    { lat: 25.1459323, lon: 55.3852940 },
    { lat: 25.1480908, lon: 55.3862172 },
    { lat: 25.1509321, lon: 55.3873900 },
    { lat: 25.1514550, lon: 55.3876249 },
    { lat: 25.1531827, lon: 55.3883417 },
    { lat: 25.1585682, lon: 55.3904814 },
    { lat: 25.1609250, lon: 55.3913874 },
    { lat: 25.1619160, lon: 55.3917574 }
  ];

   function smoothCoordinator() {
        let temp = [];
      for(let i = 0; i < roadCor.length; i++){
        if(i < (roadCor.length - 1)){
          const latDifference = (roadCor[i+1].lat - roadCor[i].lat)/10;
          const lonDifference = (roadCor[i+1].lon - roadCor[i].lon)/10;
          console.log('latDiff: ', latDifference);

        for(let j = 0; j <=10; j++ ){
          const smoothLat = roadCor[i].lat + latDifference*j;
          const smoothLon = roadCor[i].lon + lonDifference*j;
          temp.push({lat: smoothLat, lon: smoothLon});
        }   
      }
   
    }

    setSmoothCoordinates(temp);
  }

  function corLoader(order){
    console.log("order: ", order);
    console.log("smoothCoordinates length: ", smoothCoordinates.length);
    setCoordinates([smoothCoordinates[order].lat, smoothCoordinates[order].lon]);
    console.log(order);
    console.log(smoothCoordinates);
  }

  const orderRef = useRef(0);

  useEffect(()=> {
    smoothCoordinator();
  }, [])

  useEffect(()=> {
    if(smoothCoordinates.length > 0){
      console.log("interval created!")
      setInterval(() => corLoader(orderRef.current++), 100)
    }
  }, [smoothCoordinates]);

 





  return(
    <>
      <MapContainer center={[25.1201526, 55.3654066]} zoom={14} scrollWheelZoom={false} style={{ height: "100vh", width: "100%"}} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        <Marker position={coordinates}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>

    </>
    
  )
}