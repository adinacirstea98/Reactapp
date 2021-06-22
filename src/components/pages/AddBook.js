import React, { useState } from "react"
import { Button, Form, FormGroup, Label, Input, FormText, ButtonGroup } from 'reactstrap';
import axios from 'axios';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom"
import { toast } from "react-toastify";


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

function AddBook() {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { currentUser } = useAuth();
    const { uid } = currentUser;

    const handleSubmit = (event) => {
      event.preventDefault();
      setLoading(true);
      const { target } = event;
      const formData = new FormData();
      formData.append("userId", uid);
      for (let el of target) {
        if (el.name) {
          if (el.files) {
            formData.append(el.name, el.files[0]);
          } else {
            formData.append(el.name, el.value);
          }
        }
      }
      axios({
          method: "post",
          url: "http://localhost:8080/add-book",
          headers: {'Content-Type': 'multipart/form-data'},
          data: formData
        })
        .then(res => {
          const { data = {} } = res;
          toast(`Book ${data.title} has been added successfully`);
          history.push("/my-books");
        })
        .catch(err => {
          toast.error(err.response);
          setLoading(false);
        })
    }

    const handleCancel = (event) => {
      history.push("/my-books");
    }

    return (
        <>
            <GlobalStyle />
            <StyledFormWrapper>
                <StyledForm onSubmit={handleSubmit}>
                    <div style={{marginTop:60}}>
                        <h1>Add content here:</h1>
                    </div>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" placeholder="book title" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="pageCount">Page count</Label>
                        <Input type="text" name="pageCount" id="pageCount" placeholder="page count" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="author">Author</Label>
                        <Input type="text" name="author" id="author" placeholder="book author" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="category">Category</Label>
                      <Input type="select" name="category" id="category">
                          <option value="poetry">Poetry</option>
                          <option value="article">Article</option>
                          <option value="novel">Novel</option>
                          <option value="story">Story</option>
                          <option value="news">News</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="language">Language</Label>
                        <Input type="select" name="language" id="language">
                            <option value="english">English</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="romanian">Romanian</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" />
                    </FormGroup>
                    <StyledFieldset>
                        <Label for="image">Image</Label>
                        <Input type="file" name="image" id="image" />
                    </StyledFieldset>
                    <StyledFieldset>
                        <Label for="pdf">PDF</Label>
                        <Input type="file" name="pdf" id="pdf" />
                    </StyledFieldset>
                    <ButtonGroup style={{marginLeft:220}}>
                      <Button style={{backgroundColor: 'white', color: 'black', borderWidth: 1, borderColor: 'black'}} disabled={loading}>Submit</Button>
                      <Button onClick={handleCancel} style={{backgroundColor: 'white', color: 'black', borderWidth: 1, borderColor: 'black'}}>Cancel</Button>
                    </ButtonGroup>
                </StyledForm>
            </StyledFormWrapper>
        </>
    )
}

export default AddBook;