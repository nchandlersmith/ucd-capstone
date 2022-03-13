import {useEffect, useState} from "react";
import {PhotoDao} from "../../../../backend/src/models/photosModels"
import axios from "axios";
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import Button from "react-bootstrap/Button";

interface Props {
  userId: string
}

function UserPhotos({userId}: Props): JSX.Element {
  const getUserPhotosUrl = "https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos"
  const [photos, setPhotos] = useState<PhotoDao[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  useEffect(() => {
    axios.get(getUserPhotosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})
      .then(response => {
        setPhotos(response.data.photos)
      })
      .catch(err => console.error(err))
  }, [refreshTrigger])

   if (photos.length === 0) {
     return <></>
   }
  return (
    <>
      <Button onClick={() => setRefreshTrigger(!refreshTrigger)}>Refresh</Button>
      <div>{photos.map((photo, index) => photoCard(photo, index))}</div>
    </>
  )
}

function photoCard(photo: PhotoDao, index: number): JSX.Element {
  return (
    <Card key={index}>
      <Card.Body>
        <Card.Title>{photo.photoLabel}</Card.Title>
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{photo.vendorId}</ListGroupItem>
        <ListGroupItem>{photo.vendorService}</ListGroupItem>
        <ListGroupItem>Added: {photo.addedOn}</ListGroupItem>
      </ListGroup>
    </Card>
  )
}

export default UserPhotos
