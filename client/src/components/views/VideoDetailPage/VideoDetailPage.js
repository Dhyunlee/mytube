import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);

  const videoId = props.match.params.videoId;
  const variable = {
    videoId: videoId,
  };
  useEffect(() => {
    Axios.post('/api/video/getVideoDetail', variable).then(resData => {
      if (resData.data.success) {
        setVideoDetail(resData.data.videoDetail);
      } else {
        alert('비디오 정보를 가져오는데 실패했습니다.');
      }
    });
  }, []);
  console.log(VideoDetail)

  if (VideoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div
            style={{
              width: '100%',
              padding: '3rem 4rem',
            }}
          >
            <video
              style={{
                width: '100%',
              }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>

            {/* Comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          Side Videos
        </Col>
      </Row>
    );
  } else {
    return <div>Loding...</div>;
  }
}

export default VideoDetailPage;
