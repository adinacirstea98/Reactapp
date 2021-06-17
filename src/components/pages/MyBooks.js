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

import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import BookCard from '../../books/BookCard';
import '../../App.css';

function MyBooks() {
  // States
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { currentUser } = useAuth();
  const history = useHistory();
  const { uid } = currentUser;

  // Handle Loading
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
    })
    .catch(err => {
      toast.error("Something went wrong on loading your books");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [uid]);

  const handleEdit = (id) => {
    console.log(id, cards[id]);
    const card = cards.find(({ _id }) => _id === id);
    history.push({pathname: "/edit-book", state: card});
  };

  const handleDelete = (id) => {
    axios({
      method: "delete",
      url: "http://localhost:8080/delete-book/" + id,
    })
    .then(res => {
      const cardIndex = cards.findIndex(card => card._id === id);
      if (cardIndex >= 0) {
        const cardTitle = cards[cardIndex].title;
        const newCards = [...cards];
        newCards.splice(cardIndex, 1);
        toast(`Book ${cardTitle} has been deleted`);
        setCards(newCards);
      }
    })
    .catch(err => {
      toast.error(err.response);
    })
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item) => {
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
              handleEdit={handleEdit.bind(null, item._id)}
              handleDelete={handleDelete.bind(null, item._id)}
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
    <div className='w-100 h-100' style={{ 
      backgroundImage: `url(/image.jpg)` 
    }}>
      <Link to='/add-book'>
        <Button>Add book</Button>
      </Link>
      {handleCards()}
    </div>
  );
}

export default MyBooks;