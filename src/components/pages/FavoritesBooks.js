import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';

import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import BookCard from '../../books/BookCard';
import '../../App.css';
import Button from "react-bootstrap/Button";

function FavoritesBooks() {
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
      url: "http://localhost:8080/favorites-books",
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
      const newCards = [...cards];
      const card = newCards.find(({ _id }) => _id === id);
      toast(`Book ${card.title} has been added to favorites successfully`);
      const userIndex = (card.users || []).findIndex((userId) => userId === uid);
      if (!card.users) {
        card.users = [uid];
      } else if (userIndex < 0) {
        card.users.push(uid);
      } else {
        card.users.splice(userIndex, 1);
      }
      setCards(newCards);
    })
    .catch(err => {
      console.log(err);
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
              pageCount={item.pageCount}
              language={item.language}
              author={item.author}
              description={item.description}
              previewLink={item.pdfPath}
              handleFavorite={handleFavorite.bind(null, item._id)}
              isFavorite={(item.users || []).includes(uid)}
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
    <div className='background-img' >
      <p className='cls'>Favorites books</p>
      <Link to='/add-book'>
        <Button variant="light" style={{ marginLeft: 690 }}>Add a new book</Button>
      </Link>
      <div>
        {handleCards()}
      </div>
    </div>
  );
}

export default FavoritesBooks;