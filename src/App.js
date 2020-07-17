import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
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
        <Fragment>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <div
              onClick={() => setShowPopup({
                [entry._id]: true
              })}>
              <svg
                className="marker"
                viewBox="0 0 24 24"
                width={12 * viewport.zoom}
                height={12 * viewport.zoom}
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopup[entry._id] && <Popup
            latitude={entry.latitude}
            longitude={entry.longitude}
            dynamicPosition={true}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setShowPopup({})}
            anchor="top" >
            <div className="popup">
              <h3>{entry.title}</h3>
              <p>{entry.comments}</p>
              <small>Visited on: {new Date(entry.visitedDate).toLocaleDateString()}</small>
            </div>
          </Popup>}
        </Fragment>
      ))}
    </ReactMapGL>


  );
};

export default App;
