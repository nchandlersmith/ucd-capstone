# Capstone Photos

## Photo Management Epic

### Feature - Add Photo

As a member of Capstone Photo, I want to upload photos, so that I can get my photos processed at participating vendors.

### Feature - Receive Processing Updates

As a member of Capstone Photo, I want to receive notifications when my vendor starts or finishes work on my photo.

## Vendor Management Epic
__Summary:__ Vendors will download photos for processing.

### Feature - Vendor Signup

As a photo processing vendor, I want to sign up to Capstone Photos, so that I can process photos from my customers.

### Feature - Vendor Receives Notifications

As a photo processing vendor, I want to receive notifications when someone wants me to process their photos, so that I
don't have to notify them directly.

## Techy Stuff

- Frontend: React app in S3
- Backend: Node Lambdas
- Database: DynamoDB - vendor, customer, and photo details
- S3: Photo store
- SNS: Send notifications
- Auth0: implements auth. _Should_ be able to embed customer/vendor in the JWTs and manage permissions appropriately. See [Add User Roles To Tokens](https://auth0.com/docs/manage-users/access-control/sample-use-cases-rules-with-authorization)
