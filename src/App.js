import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [event, setEvent] = useState({
    eventId: "",
    eventName: "",
    venue: "",
    capacity: ""
  });

  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const resp = await axios.get("https://eventmanagementsystem-backend-4.onrender.com/events");
      setData(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ADD Event (with validation)
  const handleAdd = async () => {
    if (
      !event.eventId.trim() ||
      !event.eventName.trim() ||
      !event.venue.trim() ||
      !event.capacity.trim()
    ) {
      alert("Please fill all fields properly!");
      return;
    }

    try {
      const payload = {
        eventId: Number(event.eventId),
        eventName: event.eventName.trim(),
        venue: event.venue.trim(),
        capacity: Number(event.capacity)
      };

      const resp = await axios.post("https://eventmanagementsystem-backend-4.onrender.com/events", payload);
      setMsg(resp.data.msg);

      setEvent({ eventId: "", eventName: "", venue: "", capacity: "" });
      fetchEvents();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // UPDATE Event (with validation)
  const handleUpdate = async () => {
    if (!event.eventId.trim()) {
      alert("Select an event to update!");
      return;
    }

    if (
      !event.eventName.trim() ||
      !event.venue.trim() ||
      !event.capacity.trim()
    ) {
      alert("Please fill all fields before updating!");
      return;
    }

    try {
      const payload = {
        eventName: event.eventName.trim(),
        venue: event.venue.trim(),
        capacity: Number(event.capacity)
      };

      const resp = await axios.put(
        `https://eventmanagementsystem-backend-4.onrender.com/events/${event.eventId}`,
        payload
      );

      setMsg(resp.data.msg);
      setEvent({ eventId: "", eventName: "", venue: "", capacity: "" });
      fetchEvents();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // DELETE Event (with validation)
  const handleDelete = async () => {
    if (!event.eventId.trim()) {
      alert("Select an event to delete!");
      return;
    }

    try {
      const resp = await axios.delete(
        `https://eventmanagementsystem-backend-4.onrender.com/events/${event.eventId}`
      );

      setMsg(resp.data.msg);
      setEvent({ eventId: "", eventName: "", venue: "", capacity: "" });
      fetchEvents();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // When user clicks a card, data fills into input fields
  const handleSelect = (item) => {
    setEvent({
      eventId: String(item.eventId),
      eventName: item.eventName,
      venue: item.venue,
      capacity: String(item.capacity),
    });
  };

  return (
    <div className="container">
      <h1 className="title">Event Management System</h1>

      <div className="form-row">
        <input
          type="number"
          placeholder="Event ID"
          value={event.eventId}
          onChange={(e) =>
            setEvent({ ...event, eventId: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Event Name"
          value={event.eventName}
          onChange={(e) =>
            setEvent({ ...event, eventName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Venue"
          value={event.venue}
          onChange={(e) =>
            setEvent({ ...event, venue: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Capacity"
          value={event.capacity}
          onChange={(e) =>
            setEvent({ ...event, capacity: e.target.value })
          }
        />
      </div>

      <div className="btn-row">
        <button className="btn add" onClick={handleAdd}>Add</button>
        <button className="btn update" onClick={handleUpdate}>Update</button>
        <button className="btn delete" onClick={handleDelete}>Delete</button>
      </div>

      {msg && <p className="msg">{msg}</p>}

      <h2 className="sub-title">Event List</h2>

      <div className="list-box">
        {data.length === 0 ? (
          <p>No events available</p>
        ) : (
          data.map((item) => (
            <div
              key={item.eventId}
              className="event-card"
              onClick={() => handleSelect(item)}
            >
              <p><b>ID:</b> {item.eventId}</p>
              <p><b>Name:</b> {item.eventName}</p>
              <p><b>Venue:</b> {item.venue}</p>
              <p><b>Capacity:</b> {item.capacity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
