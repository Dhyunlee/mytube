import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function auth_(SpecificComponent, option, adminRoute = null) {
  function AuthenticaionCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then(res => {
        //로그인 하지 않은 상태
        if (!res.payload.isAuth) {
            props.history.push('/login');
          if (option) {
            props.history.push('/login');
          }
        } else {
          //로그인 한 상태
          if (adminRoute && !res.payload.isAuth) {
            props.history.push('/');
          } else {
            if (option === false) {
              /* 
                로그인한 유저가 들어갈 수 없는 
                페이지에 접근하는 경우
              */
              props.history.push('/');
            }
          }
        }
      });
    });
    return <SpecificComponent/>;
  }
  return AuthenticaionCheck;
}
