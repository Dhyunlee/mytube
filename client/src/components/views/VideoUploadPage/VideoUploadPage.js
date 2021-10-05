import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Typography, Button, Form, message, Input, Icon, Select } from 'antd';
import Axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOptions = [
  { value: 0, label: 'Filn & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

function VideoUploadPage(props) {
  const [VideoTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState('Film & Animation');

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  }
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  }
  const onPrivateChange =(e) => {
    setPrivate(e.currentTarget.value);
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  }

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multiple/form-data'}
    }
    formData.append('file', files[0])

    Axios.post('/api/video/uploadfiles', formData, config)
      .then(res_Data => {
        console.log(res_Data.data)
        if(res_Data.data.success) {
        } else {
          alert('비디오 업로드를 실패했습니다.')
        }
      })
  }

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <Title level={2}>Upload video</Title>
      </div>

      <Form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Drop zone */}
          <Dropzone 
            onDrop={onDrop} 
            multiple={false} 
            maxSize={1000000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type='plus' style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          <div>
            <img />
          </div>
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type='primary' size='large'>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
