import React, {useState} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import {Form} from 'react-bootstrap';

function Photos() {
  const [user, setUser] = useState("")
  const [label, setLabel] = useState("")
  const [vendor, setVendor] = useState("")
  const [service, setService] = useState("")

  return (
    <Form>
      <Form.Group controlId="user">
        <Form.Label>User</Form.Label>
        <Form.Control
          type="email"
          placeholder="user@example.com"
          onChange={(event) => setUser(event.currentTarget.value)}/>
        <Form.Text>Enter your email address.</Form.Text>
      </Form.Group>
      <Form.Group controlId="photo-label">
        <Form.Label>Photo Label</Form.Label>
        <Form.Control
          type='text'
          placeholder="Label your photo"
          onChange={(event) => setLabel(event.currentTarget.value)}/>
        <Form.Text>Enter a label for your photo for you and your vendor to refer.</Form.Text>
      </Form.Group>
      <Form.Group controlId="vendor">
        <Form.Label>Vendor</Form.Label>
        <Form.Control
          type='text'
          placeholder="Vendor goes here"
          onChange={(event) => setVendor(event.currentTarget.value)}/>
        <Form.Text>Enter the name of your vendor that will work on your photo.</Form.Text>
      </Form.Group>
      <Form.Group controlId="service">
        <Form.Label>Service</Form.Label>
        <Form.Control
          type='text'
          placeholder="Service goes here"
          onChange={(event) => setService(event.currentTarget.value)}/>
        <Form.Text>Enter the service that you want the vendor to perform on your photo.</Form.Text>
      </Form.Group>
      <Button variant='primary' type='reset' onSubmit={addPhoto} disabled={disableAddPhoto()}>
        Submit
      </Button>
    </Form>
  )

  async function addPhoto() {
    const url = 'https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos'
    console.log(url)
    const data = {
      emailAddress: user,
      label,
      vendor,
      service
    }
    axios.post(url, data, {headers: {Authorization: `Bearer blarg-${user}`}})
      .then(response => {
        console.log(`response: JSON.stringify(response)`)
      })
      .catch(error => {
        console.error(`error: JSON.stringify(error)`)
      })
  }

  function disableAddPhoto() {
    return !user || !vendor || !service || !label
  }
}

export default Photos;
