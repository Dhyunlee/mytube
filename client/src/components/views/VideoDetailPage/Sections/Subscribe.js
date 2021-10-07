import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
      let subscribeNumberVariable = { userTo: props.userTo };
      let subscribedVariable = {
        userTo: props.userTo,
        userFrom: props.userFrom,
      };
      
    Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariable).then(
      resData => {
        if (resData.data.success) {
            console.log('resResult', resData.data)
          setSubscribeNumber(resData.data.subscribeNumber);
        } else {
          alert('구독자 수 정보를 받아오는데 실패했습니다.');
        }
      }
    );

    Axios.post('/api/subscribe/subscribed', subscribedVariable).then(
      resData => {
        if (resData.data.success) {
          setSubscribed(resData.data.subscribed);
        } else {
          alert('정보를 받아오지 못했습니다.');
        }
      }
    );
  }, []);

  const onSubscribe = () => {
    let subscribedVariable = {
        userTo: props.userTo,
        userFrom: props.userFrom
    }

    // 이미 구독 중이라면
    if(Subscribed) {
        Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(resData => {
                if(resData.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('구독 취소하는데 실패했습니다.')
                }
            })
    // 아직 구독 중이 아니라면
    } else {
        Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(resData => {
                if(resData.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('구독하는데 실패했습니다.')
                }
            })
    }
  }

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'} `,
          border: 0,
          borderRadius: '4px',
          color: '#fff',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;
