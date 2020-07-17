import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

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

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('submitted')
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
            </div>
          </Popup>}
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
                <div className="popup">
                  <h3>Add your new log here</h3>
                  <form onSubmit={handleSubmit} className="entry-form">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" />
                    <label htmlFor="location">Location:</label>
                    <input type="location" id="location" name="location" />
                    <label htmlFor="comments">Comments:</label>
                    <textarea row={3} type="comments" id="comments" name="comments" />
                    <label htmlFor="image">Image:</label>
                    <input type="text" id="image" name="image" />
                    <label htmlFor="visitedDate">Visit Date: </label>
                    <input type="date" id="visitedDate" name="visitedDate" />
                    <button onClick={handleSubmit}>Create Log</button>
                  </form>
                </div>
              </Popup>
            </Fragment>
          )}
        </Fragment>
      ))
      }
    </ReactMapGL >


  );
};

export default App;
