import {useEffect, useState} from "react";
import {PhotoDao} from "../../../../backend/src/models/photosModels"
import axios from "axios";
import {Card} from "react-bootstrap";

interface Props {
  userId: string
}

function UserPhotos({userId}: Props): JSX.Element {
  const getUserPhotosUrl = "https://yjpyr240cj.execute-api.us-east-1.amazonaws.com/dev/photos"
  const [photos, setPhotos] = useState<PhotoDao | null>(null)

  useEffect(() => {
    axios.get(getUserPhotosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})
      .then(response => {
        console.log(`Response from backend: ${JSON.stringify(response)}`)
        setPhotos(response.data.photos[0])
      })
      .catch(err => console.error(err))
  }, [])

   if (!photos) {
     return <></>
   }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{photos.photoLabel}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default UserPhotos
