import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardTitle, CardImg, CardBody, CardText, Button, Modal } from 'reactstrap';
import { BsTrash } from 'react-icons/bs';
import IconButton from '@material-ui/core/IconButton';
import { MDBMask, MDBView, MDBContainer, MDBRow, MDBCol } from "mdbreact";
// import "./Card.css";
// import "../components/Cards.css";

const BookCard = ({
  id,
  thumbnail,
  title,
  pageCount,
  language,
  description,
  author,
  publisher,
  previewLink,
  infoLink
}) => {
  // States
  const [modal, setModal] = useState(false);
  const handleToggleModal = () => setModal(!modal);
  const handleDelete = () => {
    // axios({
    //   method: "delete",
    //   url: "http://localhost:8080/delete-book/" + id,
    // })
    // .then(res => {
    //     const { data } = res;
    //     window.location.reload();
    // })
    // .catch(err => {
    //     console.error(err.response);
    // })
  };

  return (
    <Card body style={{ borderColor: '#333', width: '300px' }} className='card text-center'>
      <CardBody>
        <CardTitle className="text-center" >{title}</CardTitle>
      </CardBody>
      <CardImg
        top
        style={{ width: '100%', height: '233px' }}
        src={thumbnail}
        alt={title}
        desc={description}>
      </CardImg>
      
      <CardBody>
        <Button onClick={handleToggleModal}>More info</Button>
        {/* <Button onClick={handleDelete}>Delete</Button> */}
        <IconButton aria-label="delete" onClick={handleDelete}>
          <BsTrash />
        </IconButton>
      </CardBody>
      <Modal isOpen={modal} toggle={handleToggleModal}>
        <div className='modal-header d-flex justify-content-center'>
          <h5 className='modal-title text-center' id='exampleModalLabel'>
            {title}
          </h5>
          <button
            aria-label='Close'
            className='close'
            type='button'
            onClick={handleToggleModal}
          >
            <span aria-hidden={true}>X</span>
          </button>
        </div>
        <div className='modal-body'>
          <div className='d-flex justify-content-between ml-3'>
            <img src={thumbnail} alt={title} style={{ height: '200px' }} />
            <div>
              <p>Page Count: {pageCount}</p>
              <p>Language : {language}</p>
              <p>Author : {author}</p>
              <p>Publisher : {publisher}</p>
            </div>
          </div>
          <div className='mt-3'>{description}</div>
        </div>
        <div className='modal-footer'>
          <div className='left-silde'>
            <a
              href={previewLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Preview Link
            </a>
          </div>
          <div className='divider'></div>
          <div className='right-silde'>
            <a
              href={infoLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Info Link
            </a>
          </div>
        </div>
      </Modal>
    </Card>
    
  );
};

export default BookCard;