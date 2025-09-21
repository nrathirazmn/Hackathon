# CSa Recycling App
![Screenshot_20250921_182524_Expo Go](https://github.com/user-attachments/assets/27f0fe7a-ac11-431b-86b2-e2a3a84148a6)

## Problem Statement
Despite growing awareness of environmental issues, recycling remains a challenge for many in the Petaling district due to:
- Lack of knowledge on how to properly sort recyclable items and where to dispose them
- Confusion around composite materials, such as poly-coated paper, which often leads to incorrect disposal
- Inconvenience and low motivation, as recycling is perceived as time-consuming, unclear, and unrewarding

## How to Run the Application Locally

**Prerequisites:**  
- [Node.js](https://nodejs.org/) installed  
- [Expo Go](https://expo.dev/go) app installed on your phone (Android/iOS)

**Steps:**

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on your device:
   - Scan the QR code shown in your terminal or browser using the Expo Go app on your phone.
   - The app will load and run on your device.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## AWS Tools Used

- **Amazon SageMaker:**  
  Used for image classification of recyclable materials via a deployed endpoint.

- **AWS Lambda:**  
  Handles API requests from the app, invokes SageMaker for classification, and returns results.

- **Amazon Bedrock:**  
  Powers the AI chatbot assistant for recycling-related queries.

---

For more details, see the source code and documentation in the repository.
