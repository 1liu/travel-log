import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37,
    longitude: -95,
    zoom: 3,
  });

  const listLogEntries = () => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setLogEntries(data);
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    listLogEntries();
  }, []);

  console.log(logEntries)
  return (

    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/liuy23/ckcpig7jf0hha1ioy1gcdg1kq"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {logEntries.map(entry => (
        <Marker latitude={entry.latitude} longitude={entry.longitude} offsetLeft={-20} offsetTop={-10}>
          <div>{entry.title}</div>
        </Marker>
      ))}
    </ReactMapGL>


  );
};

export default App;
