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

## Workflows

### Photo processing workflow

1. User logs in to site.
2. User adds a photo to their account and provides the following:
   - Label/name/title for the photo
   - Vendor
   - Vendor options (service/product offerings)
   - Email information
3. User receives pre-signed url to upload their photo to S3
4. Vendor receives notification they have a new photo. The notification contains:
    - Pre-signed url to download the photo
    - Pre-signed url to upload the photo
5. Vendor downloads the photo. Then presumably processes the photo and sends it to the user.

### Vendor sign-up workflow
1. Vendor creates account
2. Vendor provides:
    - Name for their business
    - Service/product offerings
    - Email information

## Techy Stuff

- Frontend: React app in S3
- Backend: Node Lambdas
- Database: DynamoDB - vendor, customer, and photo details
- S3: Photo store
- SNS: Send notifications
- Auth0: implements auth. _Should_ be able to embed customer/vendor in the JWTs and manage permissions appropriately. See [Add User Roles To Tokens](https://auth0.com/docs/manage-users/access-control/sample-use-cases-rules-with-authorization)
