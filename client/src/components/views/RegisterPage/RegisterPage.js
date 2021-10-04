import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = e => {
    setEmail(e.currentTarget.value);
  };

  const onNameHandler = e => {
    setName(e.currentTarget.value);
  };

  const onPasswordHandler = e => {
    setPassword(e.currentTarget.value);
  };
  const onConfirmPasswordHandler = e => {
    setConfirmPassword(e.currentTarget.value);
  };

  const onSubmitHandler = e => {
    e.preventDefault();

    //비밀번호 확인 일치
    if(Password !== ConfirmPassword) return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')

    let body = {
      name: Name,
      email: Email,
      password: Password
    };

    dispatch(registerUser(body))
     .then(res => {
       if(res.payload.success) {
         props.history.push('/login')
       } else {
          alert('등록된 이메일입니다.');
       }
     });
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
        <input type='email' value={Email} onChange={onEmailHandler} required/>
        <label>Name</label>
        <input type='text' value={Name} onChange={onNameHandler} required/>
        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler} required/>
        <label>Confirm Password</label>
        <input
          type='password'
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
          required
        />
        <br />
        <button type='submit'>RegisterPage</button>
      </form>
    </div>
  );
}
export default withRouter(RegisterPage);
