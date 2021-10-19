import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

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

  useEffect(() => {
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

  const handleLike = () => {

    // Like 아직 클릭되지 않은 상태
    if (LikeAction === null) {
      Axios.post('/api/like/upLike', variable).then(resData => {
        if (resData.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked')

          // Dislike 클릭된 상태일 때
          if(DislikeAction !== null) {
           setDislikeAction(null);
           setDislikes(Dislikes - 1)
          }
        } else {
          console.log(resData.data)
          alert('Like를 올리는데 실패했습니다.');
        }
      });
    } else {
      // Like 가 클릭된 상태
      Axios.post('/api/like/unLike', variable).then(resData => {
        if (resData.data.success) {
          console.log('unlike', resData.data)
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          console.log(resData.data)
          alert('Like를 내리는데 실패했습니다.');
        }
      })
    }
  }

  const handleDislikes = () => {
    // Dislikes 가 이미 클릭된 상태일 때
    if(DislikeAction !== null) {
      Axios.post('/api/like/unDislike', variable)
       .then(resData => {
         if(resData.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null)
         } else {
          console.log(resData.data)
           alert('disLike 를 내리는데 실패했습니다.')
         }
       })
    } else {
      // Dislikes 가 클릭되지 않은 상태
      Axios.post('/api/like/upDislike', variable)
      .then(resData => {
        if(resData.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked')

          // Like 가 이미 클릭된 상태이면
          if(LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1)
          } 
        } else {
          console.log(resData.data)
          alert('disLike 를 올리는데 실패했습니다.')
        }
      })
    }
  }
  

  return (
    <div>
      <span
        key='comment-basic-like'
        style={{
          display: 'inline-block',
          marginRight: '10px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            paddingRight: '10px',
          }}
        >
          <Tooltip title='Like'>
            <Icon
              type='like'
              theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
              onClick={handleLike}
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
              onClick={handleDislikes}
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
