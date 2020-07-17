import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import LogForm from './LogForm'

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
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
        setLogEntries(data);
      })
      .catch(err => console.log(err))
  }

  const showAddMarkerPopup = (event) => {
    const { lngLat } = event;
    setAddEntryLocation({ latitude: lngLat[1], longitude: lngLat[0] })

  }


  useEffect(() => {
    listLogEntries();
  }, []);

  return (

    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/liuy23/ckcpig7jf0hha1ioy1gcdg1kq"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map(entry => (
        <Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
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
                fill="none"
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
              {entry.image && <img src={entry.image} alt={entry.title} />}
            </div>
          </Popup>}
        </Fragment>
      ))
      }
      {addEntryLocation && (
        <Fragment>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <svg
                className="marker yellow"
                viewBox="0 0 24 24"
                width={12 * viewport.zoom}
                height={12 * viewport.zoom}
                stroke="currentColor"
                fill="none"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            dynamicPosition={true}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntryLocation(null)}
            anchor="top" >
            <LogForm
              lngLat={[addEntryLocation.longitude, addEntryLocation.latitude]}
              onClose={() => { setAddEntryLocation(null); listLogEntries() }}
            />
          </Popup>
        </Fragment>
      )}
    </ReactMapGL >


  );
};

export default App;
