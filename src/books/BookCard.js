import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardImg, CardBody, Modal, ButtonGroup } from 'reactstrap';
import Button from "react-bootstrap/Button";
import Heart from "react-animated-heart";
import "../App.css"

const BookCard = ({
  thumbnail,
  title,
  pageCount,
  language,
  description,
  author,
  previewLink,
  handleEdit,
  handleDelete,
  handleFavorite,
  handleReview,
  isFavorite
}) => {
  // States
  const [modal, setModal] = useState(false);
  const handleToggleModal = () => setModal(!modal);

  return (
    <Card body style={{ borderColor: '#333', width: '300px' }} className='card text-center'>
      <CardBody>
        <CardTitle className="text-center" >{title}
        </CardTitle>
      </CardBody>
      <CardImg
        top
        style={{ width: '100%', height: '233px' }}
        src={thumbnail}
        alt={title}
        desc={description}>
      </CardImg>
      <CardBody>
        <ButtonGroup style={{display: "block"}}>
          <Button variant="outlined" onClick={handleToggleModal} style={{borderWidth: 1, borderColor: 'black'}}>More info</Button>
          {handleEdit && (<Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}} onClick={handleEdit}>Edit</Button>)}
          {handleDelete && (<Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}} onClick={handleDelete}>Delete</Button>)}
          {handleReview && (<Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}} onClick={handleReview}>Review</Button>)}
        </ButtonGroup>
        {handleFavorite && (<Heart isClick={isFavorite} onClick={handleFavorite}/>)}
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
          <div className='d-flex'>
            <img src={thumbnail} alt={title} style={{ height: '200px' }} />
            <div>
              <p className="textbold">Page Count: {pageCount}</p>
              <p>Language : {language}</p>
              <p>Author : {author}</p>
            </div>
          </div>
          <div className='mt-3'>{description}</div>
        </div>
        <div className='modal-footer'>
          <div>
            <a
              href={previewLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read this book
            </a>
          </div>
        </div>
      </Modal>
    </Card>
    
  );
};

export default BookCard;