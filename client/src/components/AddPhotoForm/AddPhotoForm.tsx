import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import {DropdownButton, Form, InputGroup, Dropdown} from 'react-bootstrap';
import {Vendor} from "../../../../backend/src/models/vendorModels"

interface Props {
  userId: string
}

function AddPhotoForm({userId}: Props): JSX.Element {
  const [label, setLabel] = useState("")
  const [vendor, setVendor] = useState("")
  const [service, setService] = useState("")
  const [file, setFile] = useState<any | null | undefined>(null)
  const [vendors, setVendors] = useState<string[]>([])
  const [serviceOptions, setServiceOptions] = useState<string[]>([])
  const [allOptions, setAllOptions] = useState<Vendor[]>([])

  useEffect(() => {
    const url = "https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/vendors"
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer blarg-${userId}`
    }
    axios.get(url, {headers})
      .then(response => {
        setAllOptions(response.data)
        const vendorNames = response.data.map((vendor: Vendor) => vendor.vendorName)
        setVendors(vendorNames)
      })
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    const servicesFromSelectedVendor: string[] = allOptions.find((vendorOption) => vendorOption.vendorName === vendor)?.vendorServices || []
    setServiceOptions(servicesFromSelectedVendor)
  }, [vendor])

  return (
    <Form>
      <Form.Group controlId="photo-label">
        <Form.Label>Photo Label</Form.Label>
        <Form.Control
          type='text'
          placeholder="Label your photo"
          value={label}
          onChange={(event) => setLabel(event.currentTarget.value)}/>
      </Form.Group>
      <Form.Group controlId="vendor">
        <InputGroup>
          <DropdownButton title="Vendor" onSelect={(eventKey: string | null) => handleVendorSelect(eventKey)}>
            {vendors.length > 0 && vendors.map((vendor, index) => (<Dropdown.Item eventKey={vendor} key={`vendor-${index}`}>{vendor}</Dropdown.Item> ))}
          </DropdownButton>
          <Form.Control
            type='text'
            placeholder="Select vendor from dropdown"
            value={vendor}
            readOnly/>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="service">
        <InputGroup>
          <DropdownButton title={"Service"} onSelect={(eventKey: string | null) => handleServiceSelect(eventKey)}>
            {serviceOptions.length > 0 && serviceOptions.map((service, index) => (<Dropdown.Item eventKey={service} key={`service-${index}`}>{service}</Dropdown.Item> ))}
          </DropdownButton>
        <Form.Control
          type='text'
          placeholder="Select service from dropdown"
          value={service}
          readOnly/>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="photo">
        <Form.Label>Photo</Form.Label>
        <Form.Control
          type="file"
          onChange={(event) => handlePhotoChange(event)}/>
      </Form.Group>
      <Button variant='primary' type='reset' onClick={async () => {
        await addPhoto()
      }} disabled={disableAddPhoto()}>
        Submit
      </Button>
    </Form>
  )

  async function addPhoto() {
    const url = 'https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos'
    const data = {
      emailAddress: userId,
      label,
      vendor,
      service
    }
    axios.post(url, data, {headers: {Authorization: `Bearer blarg-${userId}`}})
      .then(response => {
        return response.data.putPhotoSignedUrl
      })
      .then((url) => {
        axios.put(url, file,{headers: {"Content-Type": file.type}})
      })
      .then(() => {})
      .catch(error => {
        console.error(`error: ${JSON.stringify(error)}`)
      })
  }

  function handlePhotoChange(event: any) {
    setFile(event.target.files[0])
  }

  function handleVendorSelect(eventKey: string | null) {
    setVendor(eventKey || "")
    setService("")
  }

  function handleServiceSelect(eventKey: string | null) {
    setService(eventKey || "")
  }

  function disableAddPhoto() {
    return !vendor || !service || !label || !file
  }
}

export default AddPhotoForm;
