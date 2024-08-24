import { useEffect, useState } from 'react';
import TrackList from './components/TrackList';
import TrackForm from './components/TrackForm';
import NowPlaying from './components/NowPlaying';
import * as trackService from './services/trackService';

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTrack, setEditTrack] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackList = await trackService.index();
        if (trackList.error) {
          throw new Error(trackList.error);
        }
        setTracks(trackList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTracks();
  }, []);

  const handleAddTrack = async (formData) => {
    try {
      const newTrack = await trackService.create(formData);
      if (newTrack.error) {
        throw new Error(newTrack.error);
      }
      setTracks([...tracks, newTrack]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTrack = (track) => {
    setIsFormOpen(true);
    setEditTrack(track);
  };

  const handleUpdateTrack = async (formData, id) => {
    try {
      const updatedTrack = await trackService.update(formData, id);
      if (updatedTrack.error) {
        throw new Error(updatedTrack.error);
      }
      const updatedTrackList = tracks.map((track) =>
        track._id !== updatedTrack._id ? track : updatedTrack
      );
      setTracks(updatedTrackList);
      setIsFormOpen(false);
      setEditTrack(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormView = (track) => {
    setIsFormOpen(!isFormOpen);
    if (track && track.title) {
      setEditTrack(track);
    } else {
      setEditTrack(null);
    }
  };

  const handleDeleteTrack = async (id) => {
    try {
      const deletedTrack = await trackService.remove(id);
      if (deletedTrack.error) {
        throw new Error(deletedTrack.error);
      }
      setTracks(tracks.filter((track) => track._id !== id));
      if (currentTrack && currentTrack._id === id) {
        setCurrentTrack(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  return (
    <>
      {isFormOpen ? (
        <TrackForm
          handleAddTrack={handleAddTrack}
          handleUpdateTrack={handleUpdateTrack}
          currentTrack={editTrack}
          setIsFormOpen={setIsFormOpen}
        />
      ) : (
        <>
          <button onClick={() => handleFormView(null)}>Add New Track</button>
          <TrackList
            tracks={tracks}
            handleDeleteTrack={handleDeleteTrack}
            handlePlayTrack={handlePlayTrack}
            handleEditTrack={handleEditTrack}
          />
          {currentTrack ? (
            <NowPlaying currentTrack={currentTrack} />
          ) : (
            <h3>No track is playing</h3>
          )}
        </>
      )}
    </>
  );
};

export default App;
