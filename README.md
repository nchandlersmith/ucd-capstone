# Capstone Photos

## Photo Management Epic

### Feature - Add Photo

As a user of Capstone Photo, I want to upload photos, so that I can get my photos processed at participating vendors.

### Feature - Receive Processing Updates

As a user of Capstone Photo, I want to receive notifications when my vendor starts or finishes work on my photo.

## Vendor Management Epic
__Summary:__ Vendors will download photos for processing.

### Feature - Vendor Signup

As a photo processing vendor, I want to sign up to Capstone Photos, so that I can process photos from my customers.

### Feature - Vendor Receives Notifications

As a photo processing vendor, I want to receive notifications when someone wants me to process their photos, so that I
don't have to notify them directly.

## Workflows

### User workflow

1. User logs in to site.
2. User adds a photo to their account and provides the following:
   - Label/name/title for the photo
   - Vendor
   - Vendor service
   - Email information
3. User receives pre-signed url to upload their photo to S3
4. Vendor receives notification they have a new photo. The notification contains:
    - Pre-signed url to download the photo
    - Pre-signed url to upload the photo
5. Vendor downloads the photo. Then presumably processes the photo and sends it to the user.

### Vendor workflow
1. Vendor creates account
2. Vendor receives notification photo needs processing.
3. Vendor downloads photos when they need processed.
4. Vendor updates status when finished.

## Technical Things

- Frontend: React app in S3
- Backend: Node Lambdas
- Database: DynamoDB - vendor, customer, and photo details
- S3: Photo store
- SNS: Send notifications
- Auth0: implements auth. _Should_ be able to embed customer/vendor in the JWTs and manage permissions appropriately. See [Add User Roles To Tokens](https://auth0.com/docs/manage-users/access-control/sample-use-cases-rules-with-authorization)

## User stories

### Backlog
- __Authorization:__ Use Auth0 for authorization
- __Role-Based Access:__ Users access their photos. Vendors access their shop. Admin?
- __User Sign Up:__ As a user, I want to sign up for Capstone Photos, so that I can get my photos processed conveniently.
- __New Photo Notification:__ As a vendor, I want to be notified when I have new photos to be processed.
- __Processing Begins Notification:__ As a user, I want to be notified when I have new photos to be processed.
- __Processing Complete Notification:__ As a user, I want to be notified when my photos are done processing, so that I can pick them up or look to them to be delivered.

### In Progress
- __Download:__ As a vendor, I want to download a photo, so that I can process the photo.

### Done
- __Upload:__ As a user, I want to upload a photo, so that a vendor can work on it.
- __Vendor Sign Up:__ As a vendor, I want to sign up for Capstone Photos, so that I can process photos from my customers.
- __Select Vendor:__ As a user, I want to select the vendor to work on my photo, so that I get the vendor I like.
- __Select Service:__ As a user, I want to select the service from a vendor, so that I get the package that I want.

