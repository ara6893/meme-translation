import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Form, Button, Spinner, OverlayTrigger, Modal } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { form, get, toApiUrl } from './services/API';

interface ImageMetadata{
  url: string;
  score: number;
}

interface WebContent{
  fullMatchingImages?: ImageMetadata[];
  partialMatchingImages?: ImageMetadata[];
  webEntities?: {
    description: string;
    score: number;
  }[];
  bestGuessLabels?: {
    label: string;
  }[];
}
interface Metadata {
  translation: string;
  original: string;
  webEntities: WebContent;
  landmarks: [];
}

function App() {
  const [metadata, setMetadata] = useState<Metadata>();
  const [imageUrl, setImageUrl] = useState('');
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
          const {id, imageId} = JSON.parse(data)
          get(`/metadata/${id}`).then((res:any)=>{
            setMetadata(res as Metadata);
            console.log(res)
            setImageUrl(toApiUrl(`/public/images/${imageId}.png`))
            setLoading(false);
          })
        })
        .catch(error => {
          setLoading(false)
          setError(error)
        })
      }
    }
  }
  
  return (
    <div className="container py-3">
      {
        error && <div className="alert alert-danger">
          {error}
        </div>
      }
      <div className="col">
        <Form>
          <div className="alert alert-info">
            To use this site, simply upload a meme into the form below. This will be pass through Google Vision's suite of 
            ML products and the results will be displayed. 
          </div>
          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Upload an image: </Form.Label>
            <Form.Control type="file" onChange={handleFileChange}/>
          </Form.Group>
        </Form>
        {
          loading ? 
            <Spinner animation="border" role="status" className="text-center">
            </Spinner>
          : <>
          <div className="d-flex justify-content-around">
            <div className="col-md-5">
              {fileUrl && <img alt="meme display" src={fileUrl}></img>}
              <p>Original: {metadata?.original || <i>no text found</i>}</p>
            </div>
            <div className="col-md-5">
              {imageUrl && <img alt="meme display" src={imageUrl}></img>}
              <p>Translation: {metadata?.translation  || <i>no text found</i>}</p>
            </div>
          </div>
          {
            metadata && <>
            <ul aria-label="Best guess(es)"> 
              {metadata.webEntities?.bestGuessLabels?.map(e=><li>{e.label}</li>)}
            </ul>
            {
              metadata.landmarks.length ?
              <ul aria-label="Landmark(s)"> 
                {metadata.landmarks?.map(e=><li>{e}</li>)}
              </ul>
              : <></>
            }
            <p>
              Related Content: <div>
              {metadata.webEntities?.fullMatchingImages?.map((e, i)=>
                <img className="related-content" src={e.url} onError={()=>metadata.webEntities?.fullMatchingImages?.splice(i, 1)}/>)
              }
              {metadata.webEntities?.partialMatchingImages?.map((e, i)=>
                <img className="related-content" src={e.url} onError={()=>metadata.webEntities?.partialMatchingImages?.splice(i, 1)}/>)
              }
              </div>
            </p>
          </>
          }
          </>
        }
      </div>
    </div>
  );
}

export default App;
