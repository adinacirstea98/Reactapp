import React, { useState } from "react"
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';

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
        <Form onSubmit={handleSubmit}>
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
            <FormGroup>
            <Label for="image">Image</Label>
            <Input type="file" name="image" id="image" />
            </FormGroup>
            <FormGroup>
            <Label for="pdf">PDF</Label>
            <Input type="file" name="pdf" id="pdf" />
            </FormGroup>
            <Button>Submit</Button>
        </Form>
    )
}

export default AddBook;