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
    Axios.get("https://react-fileupload.thedeveloperx.com/videos").then((response) => {
      setVideoList(response.data);
    });
  };

  useEffect(() => {
    getVideos();
  }, []);

  const deleteVideos = (id) => {
    Axios.delete(`https://react-fileupload.thedeveloperx.com/delete/${id}`).then((response) => {
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
              <video src={`https://react-fileupload.thedeveloperx.com/${val.filename}`} width="750" height="500" controls>
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
