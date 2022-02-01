import { useState, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { ToastContainer } from 'react-toastify';
import Axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {

  const [videoList, setVideoList] = useState([]);

  const onSuccess = (savedFiles) => {
    getVideos();
  };

  const getVideos = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/videos`).then((response) => {
      setVideoList(response.data);
    });
  };

  useEffect(() => {
    getVideos();
  }, []);

  const deleteVideos = (id) => {
    Axios.delete(`${process.env.REACT_APP_API_URL}/delete/${id}`).then((response) => {
      setVideoList(
        videoList.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  return (
    <div className="App">
      <FileUploader onSuccess={onSuccess} />
      <ToastContainer />
      <br />
      {videoList.map((val, key) => {
        return (
          <div className="employee">
            <div>
              <video src={`${process.env.REACT_APP_API_URL}/${val.filename}`} width="750" height="500" controls>
              </video>
              <h3>{val.filename}</h3>
              <button
                onClick={() => {
                  deleteVideos(val.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
