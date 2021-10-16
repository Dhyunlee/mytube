import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState('');

  const handleClickOpenReply = () => {
    setOpenReply(!OpenReply);
  };

  const handleChange = e => {
    setCommentValue(e.currentTarget.CommentValue);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post('/api/comment/saveComment', variables).then(resData => {
      if (resData.data.success) {
        setCommentValue(''); 

        props.refreshFunction(resData.data.comment);
      } else {
        alert('커멘트를 저장하지 못했습니다.');
      }
    });
  };

  const actions = [
    <span onClick={handleClickOpenReply} key='comment-basic-reply-to'>
      Reply to
    </span>,
  ];
  return (
    <div>
      {props.comment.writer && (
        <Comment
          actions={actions}
          acthor={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt />}
          content={<p>{props.comment.content}</p>}
        />
      )}

      {OpenReply && (
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
          <button
            style={{ width: '20%', height: '52px' }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
