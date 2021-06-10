import React, { useState } from "react"
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import styled, { createGlobalStyle, css } from 'styled-components';

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
  top: 107%;
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

/* 
  {
    "title": "",
    "image": "",
    "category": "poetry / article / novel / story",
    "author": "",
    "pageCount": "",
    "language": "",
    "description": "",
    "tags": "",
    "userId": "",
    "pdf": ""
  }
*/

function AddBook() {
    const [loading, setLoading] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        const { target } = event;
        const formData = new FormData();
        for (let el of target) {
            if (el.files) {
                formData.append(el.name, el.files[0]);
            } else {
                formData.append(el.name, el.value);
            }
        }
        setLoading(true);
        axios({
            method: "post",
            url: "http://localhost:8080/add-book",
            headers: {'Content-Type': 'multipart/form-data'},
            data: formData
          })
          .then(res => {
              const { data } = res;
              console.log(res);
          })
          .catch(err => {
              console.log(err.response);
          })
          .finally(() => {
              setLoading(false);
          });
    }

    return (
        <>
            <GlobalStyle />
            <StyledFormWrapper>
                <StyledForm onSubmit={handleSubmit}>
                    <div>
                        <h1>Add content here:</h1>
                    </div>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" placeholder="book title" />
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
                    <StyledButton >Submit</StyledButton >
                </StyledForm >
            </StyledFormWrapper>
        </>
    )
}

export default AddBook;