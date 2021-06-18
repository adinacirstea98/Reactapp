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
import { ToastContainer, toast } from 'react-toastify';
import { ButtonGroup } from 'reactstrap';
import { useAuth } from "../../contexts/AuthContext"
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';

import BookCard from '../../books/BookCard';
import '../../App.css';

function Books() {
  // States
  var [maxResults, setMaxResults] = useState(40);
  const [startIndex, setStartIndex] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { currentUser } = useAuth()
  const { uid } = currentUser;

  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: "http://localhost:8080/all-books",
      headers: {'Content-Type': "application/json" },
    })
    .then(res => {
      const { data } = res;
      setCards(data);
    })
    .catch(err => {
      toast.error("Something went wrong on loading your books");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);
  
  // Handle Search
  const handleSubmit = () => {
    setLoading(true);
    axios({
        method: "get",
        url: "http://localhost:8080",
        headers: {'Content-Type': "application/json" }

      })
      .then(res => {
        const { data } = res;
        setCards(data);
      })
      .catch(err => {
        console.error(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFavorite = (id) => {
    console.log("handleFavorite", id);
    axios({
      method: "patch",
      url: "http://localhost:8080/set-favorite/" + id,
      headers: {'Content-Type': "application/json" },
      data: {
        user: uid
      }
    })
    .then(res => {
      const card = cards.find(({ _id }) => _id === id);
      console.log(card);
      toast(`Book ${card.title} has been added to favorites successfully`);
    })
    .catch(err => {
      console.log(err);
      toast.error(err.response);
    })
  };

  const handleReview = (id) => {
    console.log("handleReview", id);
  };

  // Main Show Case
  const mainHeader = () => {
    return (
      <div className='main-image d-flex justify-content-center align-items-center flex-column'>
        <div className='filter'></div>
        <h1 className='display-2 text-center text-white mb-3' style={{ zIndex: 2 }}>
          Find a book!
        </h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          {/* <ButtonGroup style={{marginLeft:275, marginBottom:30}}>
          <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>All</Button>
            <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>Poetry</Button>
            <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>Article</Button>
            <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>Novel</Button>
            <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>Story</Button>
            <Button variant="outlined" style={{borderWidth: 1, borderColor: 'black'}}>News</Button>
          </ButtonGroup> */}
          <InputGroup size='lg' className='mb-3'>
            <Input placeholder='Book Search' value={query} onChange={e => setQuery(e.target.value)}/>
            <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={handleSubmit}>
                <i className='fas fa-search'></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          
        </div>
      </div>
    );
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        return (
          <div className='col-lg-4 mb-3' key={item._id}>
            <BookCard
              id={item._id}
              thumbnail={item.imagePath}
              title={item.title}
              // pageCount={item.volumeInfo.pageCount}
              language={item.language}
              author={item.author}
              // publisher={item.volumeInfo.publisher}
              description={item.description}
              previewLink={item.pdfPath}
              // infoLink={item.volumeInfo.infoLink}
              handleFavorite={handleFavorite.bind(null, item._id)}
              handleReview={handleReview.bind(null, item._id)}
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
      {mainHeader()}
      {handleCards()}
    </div>
  );
}

export default Books;