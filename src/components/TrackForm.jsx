import { useState, useEffect } from 'react';

const TrackForm = ({ handleAddTrack, handleUpdateTrack, currentTrack, setIsFormOpen }) => {
const initialState =
{  title: '',
    artist: '' 
};

const [formData, setFormData] = useState(currentTrack || initialState);

useEffect(() => {
    if (currentTrack) {
        setFormData({ title: currentTrack.title, artist: currentTrack.artist });
    } else {
        setFormData(initialState);
    }
}, [currentTrack]);

const handleSubmit = (event) => {
    event.preventDefault();
    if (currentTrack) {
        handleUpdateTrack(formData, currentTrack._id);
    } else {
        handleAddTrack(formData);
    }
    setFormData(initialState);
    setIsFormOpen(false);
};

const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
};

return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="title">Track Title:</label>
            <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
        />
        </div>
        <div>
            <label htmlFor="artist">Track Artist:</label>
            <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            />
        </div>
    <button type="submit">
        {currentTrack ? 'Update Track' : 'Add Track'}
    </button>
    <button type="button" onClick={() => setIsFormOpen(false)}>Close Form</button>
    </form>
);
};

export default TrackForm;
