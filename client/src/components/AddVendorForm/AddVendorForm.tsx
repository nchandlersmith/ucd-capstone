import {Form} from "react-bootstrap";

function AddVendorForm(): JSX.Element {
  return (
    <Form>
      <Form.Group controlId="vendor-name">
        <Form.Label>Vendor Name</Form.Label>
        <Form.Control type="text"/>
        <Form.Text>This is the name your customers will see.</Form.Text>
    </Form.Group>
      <Form.Group controlId="vendor-services">
        <Form.Label>Vendor Services</Form.Label>
        <Form.Control type="text"/>
        <Form.Text>Your customer will select one of these</Form.Text>
      </Form.Group>
    </Form>)
}

export default AddVendorForm
