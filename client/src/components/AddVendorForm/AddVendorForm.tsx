import {Form, ListGroup, ListGroupItem} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import axios from "axios";

interface Props {
  userId: string
}

function AddVendorForm({userId}: Props): JSX.Element {
  const [vendorName, setVendorName] = useState<string>("")
  const [serviceToAdd, setServiceToAdd] = useState<string>("")
  const [services, setServices] = useState<string[]>([])

  return (
    <>
      <Form>
        <Form.Group controlId="vendor-name">
          <Form.Label>Vendor Name</Form.Label>
          <Form.Control type="text" value={vendorName} onChange={(event) => {setVendorName(event.currentTarget.value)}}/>
          <Form.Text>This is the name your customers will see.</Form.Text>
        </Form.Group>
        <ListGroup>
        </ListGroup>
        <Form.Group controlId="vendor-services">
          <Form.Label>Vendor Services</Form.Label>
          <ListGroup>
            {services.map((service, index) => (<ListGroupItem key={index}>{service}</ListGroupItem>))}
          </ListGroup>
          <Form.Control
            type="text"
            placeholder="Enter additional service here"
            value={serviceToAdd}
            onChange={(event) => setServiceToAdd(event.currentTarget.value)}/>
        </Form.Group>
        <Button onClick={updateServices}>Add to list</Button>
      </Form>
      <Button disabled={submitIsDisabled()} onClick={addVendor}>Submit</Button>
    </>
  )

  function submitIsDisabled() {
    return !vendorName || !services
  }

  function updateServices() {
    const newServicesList = services
    newServicesList.push(serviceToAdd)
    setServices(newServicesList)
    setServiceToAdd("")
  }

  function addVendor() {
    const url = "https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/vendors"
    const headers = {Authorization: `Bearer blarg-${userId}`}
    const body = JSON.stringify({
      vendorName,
      vendorServices: services
    })
    axios.post(url, body, {headers})
      .then((response) => {
        setVendorName("")
        setServiceToAdd("")
        setServices([])
      })
  }
}

export default AddVendorForm
