import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Form, Button, Spinner, OverlayTrigger, Modal } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { form } from './services/API';

function App() {
  const [translation, setTranslation] = useState('');
  const [original, setOriginal] = useState('');
  const [scene, setScene] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState('');
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result
    if(result) setFileUrl(result.toString());
  }

  useEffect(()=>{
    if(file) reader.readAsDataURL(file);
  }, [file, reader])

  const handleFileChange = (e: ChangeEvent) => {
    if((e.target as HTMLInputElement).files){
      const file = (e.target as HTMLInputElement).files?.item(0);
      if(file){
        setFile(file);
        setLoading(true)
        const formData = new FormData()
        formData.append('image', file);

        form('/parse/image', formData)
        .then(data => {
          setLoading(false);
          setTranslation(JSON.parse(data).translation)
          setOriginal(JSON.parse(data).original)
        })
        .catch(error => {
          setLoading(false)
          setError(error)
        })
      }
    }
  }
  
  return (
    <div className="container">
      {
      loading && <Modal show={true}>
        <Spinner animation="border" role="status" className="text-center">
        </Spinner>
      </Modal>
      }
      {
        error && <div className="alert alert-danger">
          {error}
        </div>
      }
      <div className="col">
        <Form>
          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Upload a Russian-language meme: </Form.Label>
            <Form.Control type="file" onChange={handleFileChange}/>
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-around">
          {fileUrl && <img alt="meme display" className="col-md-5" src={fileUrl}></img>}
          {fileUrl && <img alt="meme display" className="col-md-5" src={fileUrl}></img>}
        </div>
        {original && <p>Original: {original}</p>}
        {translation && <p>Translation: {translation}</p>}
        {scene && <p>Scene info: {scene}</p>}
      </div>
    </div>
  );
}

export default App;
