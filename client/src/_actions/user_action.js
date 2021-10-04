import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) {
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then(res => res.data);

  return {
    type: LOGIN_USER,
    payload: request,
    //서버측에서 받은 정보를 payload에 저장
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post('/api/users/register', dataToSubmit)
    .then(res => res.data);

  return {
    type: REGISTER_USER,
    payload: request,
    //서버측에서 받은 정보를 payload에 저장
  };
}


export function auth() {
  const request = axios
    .get('/api/users/auth')
    .then(res => res.data);

  return {
    type: AUTH_USER,
    payload: request,
    //서버측에서 받은 정보를 payload에 저장
  };
}