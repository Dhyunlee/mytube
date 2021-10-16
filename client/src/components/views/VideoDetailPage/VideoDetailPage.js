import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

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

    Axios.post('/api/comment/getComments', variable).then(resData => {
      if (resData.data.success) {
        console.log('data:', resData.data.comments)
        setComments(resData.data.comments);
      } else {
        alert('커멘트 정보를 가져오는데 실패했습니다.');
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setComments(Comments.concat(newComment))
  }

  if (VideoDetail.writer) {
    // 업로드한 유저이면 해당 컨텐츠 구독 버튼 비활성화

    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <Row>
        <Col lg={18} xs={24}>
          {/* view video */}
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

            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>

            {/* Comments */}
            <Comment refreshFunction={updateComment} commentList={Comments} postId={videoId} />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          {/* Side Videos */}
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loding...</div>;
  }
}

export default VideoDetailPage;
