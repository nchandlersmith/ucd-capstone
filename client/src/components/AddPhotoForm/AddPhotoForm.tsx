import React, {useState} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import {DropdownButton, Form, InputGroup, Dropdown} from 'react-bootstrap';

interface Props {
  userId: string
}

function AddPhotoForm({userId}: Props): JSX.Element {
  const [label, setLabel] = useState("")
  const [vendor, setVendor] = useState("")
  const [service, setService] = useState("")
  const [putPhotoUrl, setPutPhotoUrl] = useState("")
  const [photoFormData, setPhotoFormData] = useState<FormData | null>(null)

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
        <InputGroup>
          <DropdownButton title="Vendor" onSelect={(eventKey: string | null) => handleVendorSelect(eventKey)}>
            <Dropdown.Item eventKey="item-1">Item 1</Dropdown.Item>
            <Dropdown.Item eventKey="item-2">Item 2</Dropdown.Item>
            <Dropdown.Item eventKey="Great Pho-toes">Great Pho-toes</Dropdown.Item>
          </DropdownButton>
          <Form.Control
            type='text'
            placeholder="Select from dropdown"
            value={vendor}
            readOnly/>
        </InputGroup>
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
        <Form.Control type="file" onChange={(event) => handlePhotoChange(event)}/>
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
        setPutPhotoUrl(response.data.putPhotoSignedUrl)
      })
      .catch(error => {
        console.error(`error: ${JSON.stringify(error)}`)
      })

    axios.put(putPhotoUrl, photoFormData,{headers: {"Accept": "multipart/form-data"}})
      .then(response => console.log(`Response from s3: ${JSON.stringify(response)}`))
      .catch(error => console.error(error))
  }

  function handlePhotoChange(event: any) {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      setPhotoFormData(formData)
    }
  }

  function handleVendorSelect(eventKey: string | null) {
    console.log(eventKey)
    setVendor(eventKey || "")
  }

  function disableAddPhoto() {
    return !vendor || !service || !label || !photoFormData
  }
}

export default AddPhotoForm;
