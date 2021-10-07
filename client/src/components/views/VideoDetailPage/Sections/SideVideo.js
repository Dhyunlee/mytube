import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo(props) {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getVideos').then(resData => {
      if (resData.data.success) {
        setSideVideos(resData.data.videos);
      } else {
        alert('비디오 가져오기를 실패했습니다.');
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((video, idx) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={idx}
        style={{
          display: 'flex',
          marginBottom: '1rem',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            width: '40%',
            marginRight: '1rem',
          }}
        >
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt={video.title}
            />
          </a>
        </div>

        <div
          style={{
            width: '50%',
          }}
        >
          <a
            href={`/video/${video._id}`}
            style={{
              color: 'gray',
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                color: '#000',
              }}
            >
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: '3rem',
        }}
      />
      {renderSideVideo}
    </React.Fragment>
  );
}

export default SideVideo;
