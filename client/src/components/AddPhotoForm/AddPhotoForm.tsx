import React, {useState} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import {Form} from 'react-bootstrap';

interface Props {
  userId: string
}

function AddPhotoForm({userId}: Props): JSX.Element {
  const [label, setLabel] = useState("")
  const [vendor, setVendor] = useState("")
  const [service, setService] = useState("")

  return (
    <Form>
      <Form.Group controlId="photo-label">
        <Form.Label>Photo Label</Form.Label>
        <Form.Control
          type='text'
          placeholder="Label your photo"
          onChange={(event) => setLabel(event.currentTarget.value)}/>
      </Form.Group>
      <Form.Group controlId="vendor">
        <Form.Label>Vendor</Form.Label>
        <Form.Control
          type='text'
          placeholder="Vendor goes here"
          onChange={(event) => setVendor(event.currentTarget.value)}/>
      </Form.Group>
      <Form.Group controlId="service">
        <Form.Label>Service</Form.Label>
        <Form.Control
          type='text'
          placeholder="Service goes here"
          onChange={(event) => setService(event.currentTarget.value)}/>
      </Form.Group>
      <Form.Group controlId="photo">
        <Form.Label>Photo</Form.Label>
        <Form.Control type="file" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.files)}/>
      </Form.Group>
      <Button variant='primary' type='reset' onClick={async () => {
        console.log(userId)
        await addPhoto()
      }} disabled={disableAddPhoto()}>
        Submit
      </Button>
    </Form>
  )

  async function addPhoto() {
    const url = 'https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos'
    console.log(url)
    const data = {
      emailAddress: userId,
      label,
      vendor,
      service
    }
    console.log(`photo data: ${JSON.stringify(data)}`)
    axios.post(url, data, {headers: {Authorization: `Bearer blarg-${userId}`}})
      .then(response => {
        console.log(`response: ${JSON.stringify(response)}`)
      })
      .catch(error => {
        console.error(`error: ${JSON.stringify(error)}`)
      })
  }

  function disableAddPhoto() {
    return !vendor || !service || !label
  }
}

export default AddPhotoForm;
