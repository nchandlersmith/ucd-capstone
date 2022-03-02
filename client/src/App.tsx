import AddPhotoForm from "./components/AddPhotoForm/AddPhotoForm";
import UserPhotos from "./components/UserPhotos/UserPhotos"
import {Accordion, Alert} from "react-bootstrap";
import AccordionItem from "react-bootstrap/AccordionItem";

const userId = "user@hardcoded.com"

function App() {
  return (
    <>
      <Alert key="0">{`Logged in as ${userId}`}</Alert>
      <Accordion defaultActiveKey="0">
        <AccordionItem eventKey="0">
          <Accordion.Header>My Photos</Accordion.Header>
          <Accordion.Body>
            <UserPhotos userId={userId}/>
          </Accordion.Body>
        </AccordionItem>
        <AccordionItem eventKey="1">
          <Accordion.Header>Add Photo</Accordion.Header>
          <Accordion.Body>{<AddPhotoForm userId={userId}/>}</Accordion.Body>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default App
