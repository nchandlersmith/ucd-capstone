import {Form, ListGroup, ListGroupItem} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from "react";

function AddVendorForm(): JSX.Element {
  const [serviceToAdd, setServiceToAdd] = useState<string>("")
  const [services, setServices] = useState<string[]>([])

  return (
    <Form>
      <Form.Group controlId="vendor-name">
        <Form.Label>Vendor Name</Form.Label>
        <Form.Control type="text"/>
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
    </Form>)

  function updateServices() {
    const newServicesList = services
    newServicesList.push(serviceToAdd)
    setServices(newServicesList)
    setServiceToAdd("")
  }
}

export default AddVendorForm
