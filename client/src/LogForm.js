import React, { useState } from 'react'
import { useForm } from "react-hook-form";

const LogForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState('');

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = values => {
    values.longitude = props.lngLat[0];
    values.latitude = props.lngLat[1];
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    };
    fetch('/api/logs', req)
      .then(res => res.json())
      .then(data => {
        props.onClose();
      })
      .catch(err => {
        console.log(err);
        setErrors(err.message);
        setLoading(false);
      })

  };

  return (
    <div className="popup">
      <h3>Add your new log here</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
        {error && <h3>{error}</h3>}
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" ref={register} required />
        <label htmlFor="location">Location:</label>
        <input type="location" name="location" ref={register} />
        <label htmlFor="comments">Comments:</label>
        <textarea row={3} type="comments" name="comments" ref={register} />
        <label htmlFor="image">Image:</label>
        <input type="text" name="image" ref={register} />
        <label htmlFor="visitedDate">Visit Date: </label>
        <input type="date" name="visitedDate" ref={register} required />
        <button disabled={loading} type="submit">{loading ? 'Loading...' : 'Create Log'}</button>
      </form>
    </div>
  )
}

export default LogForm;
