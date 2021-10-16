import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector(state => state.user);
  const [CommentValue, setCommentValue] = useState('');

  const handleChange = e => {
    setCommentValue(e.currentTarget.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: videoId,
    };

    Axios.post('/api/comment/saveComment', variables).then(resData => {
      if (resData.data.success) {
        setCommentValue(''); 

        props.refreshFunction(resData.data.comment)
      } else {
        alert('커멘트를 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map((comment, idx) => (
          (!comment.responseTo && 
            <SingleComment  refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
          )
        ))}

      {/* Root Commnet From */}

      <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
        <textarea
          style={{
            width: '100%',
            borderRadius: '5px',
          }}
          onChange={handleChange}
          value={CommentValue}
          placeholder='코멘트를 작성해주세요'
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
