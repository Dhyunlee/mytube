import React, { useEffect, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import { Card, Avatar, Col, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
// const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);

  // 몽고디비에서 모든 비디오 데이터 가져오기
  useEffect(() => {
    Axios.get('/api/video/getVideos').then(resData => {
      if (resData.data.success) {
        console.log(resData.data);
        setVideo(resData.data.videos);
      } else {
        alert('비디오 가져오기를 실패했습니다.');
      }
    });
  }, []);
  const renderCards = Video.map((video, idx) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={idx}>
        <div style={{ position: 'relative' }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%' }}
              alt='thumbnail'
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className=' duration'
              style={{
                bottom: 0,
                right: 0,
                position: 'absolute',
                margin: '4px',
                color: '#fff',
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                opacity: 0.8,
                padding: '2px 4px',
                borderRadius: '2px',
                letterSpacing: '0.5px',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '12px',
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: '3rem' }}> {video.views}</span>-
        <span> {moment(video.createdAt).format('MMM Do YY')} </span>
      </Col>
    );
  });

  return (
    <div
      style={{
        width: '85%',
        margin: '3rem auto',
      }}
    >
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
