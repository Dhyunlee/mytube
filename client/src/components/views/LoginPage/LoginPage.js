import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = e => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordHandler = e => {
    setPassword(e.currentTarget.value);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    
    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
     .then(res => {
       if(res.payload.loginSuccess) {
         props.history.push('/')
         //로그인 성공시, landing page로 이동
       } else {
          alert('아이디 또는 비밀번호가 잘못 입력 되었습니다.\n아이디와 비밀번호를 정확히 입력해 주세요.')
       }
     })
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type='email' value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler} />
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
