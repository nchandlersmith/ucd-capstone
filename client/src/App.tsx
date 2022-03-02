import AddPhotoForm from "./components/AddPhotoForm/AddPhotoForm";
import UserPhotos from "./components/UserPhotos/UserPhotos"
import {Accordion} from "react-bootstrap";
import AccordionItem from "react-bootstrap/AccordionItem";

function App() {
  return (
    <Accordion defaultActiveKey="0">
      <AccordionItem eventKey="0">
        <Accordion.Header>My Photos</Accordion.Header>
        <Accordion.Body>{<UserPhotos/>}</Accordion.Body>
      </AccordionItem>
      <AccordionItem eventKey="1">
        <Accordion.Header>Add Photo</Accordion.Header>
        <Accordion.Body>{<AddPhotoForm/>}</Accordion.Body>
      </AccordionItem>
    </Accordion>
  )
}

export default App
