import React, { useEffect, useState } from "react"
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom"
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";


const GlobalStyle = createGlobalStyle`
  html {
    height: 100%
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(to bottom, #021B79);
    height: 100%;
    margin: 0;
    color: #000000;
  }
`;

const StyledFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled.button`
  display: block;
  background-color: #fff;
  color: #00000;
  font-size: 0.9rem;
  border: 2px solid gray;
  border-radius: 5px;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  box-sizing: border-box;
  margin: 0;
  position: absolute;
  top: 113%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledFieldset = styled.fieldset`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 20px 0;
  legend {
    padding: 0 10px;
  }
  label {
    padding-right: 20px;
  }
  input {
    margin-right: 10px;
  }
`;

function Review({
  openCard,
  handleToggle
}) {
    const history = useHistory();
    const { currentUser } = useAuth();
    const { uid, email } = currentUser;
    const isOpen = Boolean(openCard);
    const card = openCard || {};
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");
    
    useEffect(() => {
      if (isOpen) {
        setStars(0);
        setComment("");
      }
    }, [isOpen])

    const handleRatingChanged = (newRating) => {
      setStars(newRating);
    }

    const handleCommentChanged = (event) => {
      setComment(event.target.value);
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      event.stopPropagation();
      axios({
          method: "patch",
          url: "http://localhost:8080/rating-book/" + card._id,
          headers: {'Content-Type': 'application/json'},
          data: {
            rating: stars,
            userId: uid,
            email,
            comment
          }
        })
        .then(res => {
          toast(`Book ${card.title} has been modified successfully`);
          handleToggle(false);
        })
        .catch(err => {
          console.log(err);
          toast.error(err.response);
        })
    }

    return (
      <Modal isOpen={isOpen} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Add review for {card.title}:</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="comment">Comment</Label>
            <Input type="textarea" name="comment" id="comment" value={comment} onChange={handleCommentChanged} />
          </FormGroup>
          <ReactStars
            count={5}
            onChange={handleRatingChanged}
            size={24}
            activeColor="#ffd700"
            value={stars}
            isHalf={false}
          /> 
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
          <Button color="secondary" onClick={handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
}

export default Review;