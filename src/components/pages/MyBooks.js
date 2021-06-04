import React, { useState, useEffect } from 'react';
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';

import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext"
import BookCard from '../../books/BookCard';
import '../../App.css';

function MyBooks() {
  // States
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const { currentUser } = useAuth();
  const { uid } = currentUser;

  function handleClick() {
    history.push("/add-book");
  }

  // Handle Search
  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: "http://localhost:8080/my-books",
      headers: {'Content-Type': "application/json" },
      params: {
        uid
      }
    })
    .then(res => {
        const { data } = res;
        setCards(data);
        console.log(res);
        toast("books loaded");
    })
    .catch(err => {
        console.log(err.response);
        toast("books failed");
    })
    .finally(() => {
        setLoading(false);
    });
  }, [uid]);

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = '';
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
        }

        return (
          <div className='col-lg-4 mb-3' key={item.id}>
            <BookCard
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              pageCount={item.volumeInfo.pageCount}
              language={item.volumeInfo.language}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
              description={item.volumeInfo.description}
              previewLink={item.volumeInfo.previewLink}
              infoLink={item.volumeInfo.infoLink}
            />
          </div>
        );
      });
      return (
        <div className='container my-5'>
          <div className='row'>{items}</div>
        </div>
      );
    }
  };
  
  return (
    <div className='w-100 h-100'>
        <Button onClick = {handleClick}> Add book </Button>
        {handleCards()}
        <ToastContainer />
    </div>
  );
}

export default MyBooks;