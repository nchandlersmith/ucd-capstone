import {useEffect, useState} from "react";
import {PhotoDao} from "../../../../backend/src/models/photosModels"
import axios from "axios";
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";

interface Props {
  userId: string
}

function UserPhotos({userId}: Props): JSX.Element {
  const getUserPhotosUrl = "https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos"
  const [photos, setPhotos] = useState<PhotoDao[]>([])

  useEffect(() => {
    axios.get(getUserPhotosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})
      .then(response => {
        console.log(`Response from backend: ${JSON.stringify(response)}`)
        setPhotos(response.data.photos)
      })
      .catch(err => console.error(err))
  }, [])

   if (!photos || photos.length === 0) {
     return <></>
   }
   console.log(photos)
  return (
    <Card>
      <Card.Body>
        <Card.Title>{photos[0].photoLabel}</Card.Title>
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{photos[0].vendorId}</ListGroupItem>
        <ListGroupItem>{photos[0].vendorService}</ListGroupItem>
        <ListGroupItem>Added: {photos[0].addedOn}</ListGroupItem>
      </ListGroup>
    </Card>
  )
}

export default UserPhotos
