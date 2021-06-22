import React, { useState, useEffect } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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

  const [dropdownOpenLanguage, setOpenLanguage] = useState(false);
  const toggle1 = () => setOpenLanguage(!dropdownOpenLanguage);

  const [dropdownOpenCategory, setOpenCategory] = useState(false);
  const toggle2 = () => setOpenCategory(!dropdownOpenCategory);

  const [dropdownOpenRating, setOpenRating] = useState(false);
  const toggle3 = () => setOpenRating(!dropdownOpenRating);

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

  const handleReview = (id) => {
    console.log("handleReview", id);
  };

  // Main Show Case
  const mainHeader = () => {
    return (
      <div className='main-image d-flex justify-content-center align-items-center flex-column'>
        <div className=''></div>
        <h1 className='display-2 text-center text-black mb-3' style={{ zIndex: 2 }}>
          Find a book!
        </h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          <InputGroup size='lg' className='mb-3'>
            <Input placeholder='Book Search' value={query} onChange={e => setQuery(e.target.value)}/>
            <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={handleSubmit}>
                <i className='fas fa-search'></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          
          <ButtonGroup style={{marginLeft:350}}>

          
          <ButtonDropdown isOpen={dropdownOpenLanguage} toggle={toggle1}>
            <DropdownToggle caret>
              Language
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>English</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>German</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>French</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Romanian</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>

          <ButtonDropdown isOpen={dropdownOpenCategory} toggle={toggle2}>
            <DropdownToggle caret>
              Category
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Poetry</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Article</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Novel</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Story</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>News</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>

          <ButtonDropdown isOpen={dropdownOpenRating} toggle={toggle3}>
            <DropdownToggle caret>
              Rating
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>5</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>4</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>3</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>1</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          </ButtonGroup>
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
              handleReview={handleReview.bind(null, item._id)}
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
    <div className='w-100 h-100'>
      {mainHeader()}
      {handleCards()}
    </div>
  );
}

export default Books;