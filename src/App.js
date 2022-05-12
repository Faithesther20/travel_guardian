import React, { useState, useEffect }from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import {getPlacesData} from './api/travelAdvisorAPI'; 



const App =() => {
    const [places, setPlaces]= useState([]);
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [bounds, setBounds]= useState(null); 
    const [isLoading, setIsLoading]  = useState(false);
     
    useEffect(()=>{
        let mounted = true;
        window.addEventListener('load', (event) => { 
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
            if (mounted){
            setCoordinates({ lat: latitude, lng: longitude });
            }
        },(err)=> {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          },{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
          console.log('page is fully loaded');
        });
        return ()=>{
            mounted = false;
        }
    }, []);

    useEffect(() => {
       
        console.log(coordinates, bounds); 
        let isApiSuscribed= true;
      if(bounds){
          setIsLoading(true);
          
        getPlacesData(bounds.sw, bounds.ne)
         .then((data) => {
             
             if (isApiSuscribed){
             console.log(data);

             setPlaces(data);
             }
         });
        }
         return ()=>{
             isApiSuscribed=false;
         }
    }, [coordinates,bounds]);
    
   

    return(
        <>
            <CssBaseline />
            <Header />
            <Grid container spacing={3} style={{width:'100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                    
                    places={places}
                    isLoading ={isLoading}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds = {setBounds}
                        coordinates ={coordinates}
                    />
                </Grid>
            </Grid>
        </>
    )
}
export default App;