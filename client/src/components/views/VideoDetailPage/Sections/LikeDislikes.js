import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  useEffect(() => {
    let variable = {};
    if (props.video) {
      variable = {
        videoId: props.videoId,
        userId: props.userId,
      };
    } else {
      variable = {
        commentId: props.commentId,
        userId: props.userId,
      };
    }

    Axios.post('/api/like/getLikes', variable).then(resData => {
      if (resData.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(resData.data.likes.length);

        // 내가 이미 그 좋아요를 눌렀는지

        resData.data.likes.map(like => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('Likes의 정보를 가져오는데 실패했습니다.');
      }
    });

    Axios.post('/api/like/getDislikes', variable).then(resData => {
      if (resData.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDislikes(resData.data.dislikes.length);

        // 내가 이미 그 싫어요를 눌렀는지

        resData.data.dislikes.map(dislike => {
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('Dislikes의 정보를 가져오는데 실패했습니다.');
      }
    });
  }, []);

  return (
    <div>
      <span key='comment-basic-like' style={{
          display: 'inline-block',
          marginRight: '10px'
      }}>
        <span style={{
            display: 'inline-block',
            paddingRight: '10px'
        }}>
          <Tooltip title='Like'>
            <Icon
              type='like'
              theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
              onClick
            />
          </Tooltip>
          <span
            style={{
              display: 'inline-block',
              paddingLeft: '8px',
              cursor: 'auto',
            }}
          >
            {Likes}
          </span>
        </span>

        <span>
          <Tooltip title='Dislike'>
            <Icon
              type='dislike'
              theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
              onClick
            />
          </Tooltip>
          <span
            style={{
              display: 'inline-block',
              paddingLeft: '8px',
              cursor: 'auto',
            }}
          >
            {Dislikes}
          </span>
        </span>
      </span>
    </div>
  );
}

export default LikeDislikes;
