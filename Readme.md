# Querymind - AI Chat Application Backend

This repository contains the backend for **Querymind**, a robust AI-powered chat application. It provides a comprehensive set of APIs for user authentication, conversation management, messaging, and seamless integration with an AI model to generate intelligent responses.

## ✨ Features

- **User Authentication & Authorization**:
  - User registration with email verification.
  - Secure user login and logout.
  - Refresh token mechanism for extended sessions.
  - Password management (change, forgot, reset).
  - JWT-based authentication for protected routes.
  - Middleware to ensure email verification before accessing certain resources.
- **Conversation Management**:
  - Create new chat conversations.
  - Retrieve a user's conversations.
  - Get details of a specific conversation.
  - Update conversation titles.
  - Delete individual conversations (and all associated messages).
  - Clear all conversations for a user.
- **Messaging**:
  - Create and send messages within conversations.
  - Edit existing messages with an edit history tracking up to 10 previous versions.
  - Retrieve messages for a specific conversation.
  - Soft delete messages (marks as deleted without permanent removal).
- **AI Integration**:
  - Seamless integration with the OpenAI API to generate AI responses.
  - Fetches recent conversation history to provide context to the AI model.
- **Security & Performance**:
  - **Rate Limiting**: Implemented for authentication, email, password reset, and global API requests to prevent abuse.
  - **Security Headers**: Utilizes `helmet` for various HTTP security headers (e.g., HSTS).
  - **Robust Database Connection**: Includes retry logic for MongoDB connection stability.
  - **Centralized Error Handling**: Uses custom `ApiError` and `asyncHandler` for consistent and efficient error management.

## 🚀 Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL document database.
- **Mongoose**: MongoDB object data modeling (ODM) for Node.js.
- **JSON Web Tokens (JWT)**: For secure authentication.
- **Nodemailer**: For sending emails (e.g., email verification, password reset).
- **Gemini API**: For AI-powered text generation.
- **`cors`**: Middleware for enabling Cross-Origin Resource Sharing.
- **`cookie-parser`**: Middleware for parsing cookies.
- **`helmet`**: Middleware for securing Express apps by setting various HTTP headers.
- **`express-rate-limit`**: Middleware for limiting repeated requests to public APIs.
- **`dotenv`**: For loading environment variables from a `.env` file.
- **`crypto`**: Node.js built-in module for cryptographic functionalities (used for password reset tokens).

## 📦 Installation

To set up and run this project locally, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- MongoDB (running locally or a cloud instance like MongoDB Atlas)

### Steps

1.  **Clone the repository**:

    ```bash
    git clone <your-repository-url>
    cd querymind-backend # Assuming your repo name reflects the project name
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Create a `.env` file**:
    Create a file named `.env` in the root directory of the project and add the following environment variables. Replace the placeholder values with your actual credentials and configurations.

    ```env
    PORT=3000
    MONGODB_URI="mongodb://localhost:27017/querymind" # DB_NAME is 'querymind' as per your constant.js
    CORS_ORIGIN="http://localhost:5173" # Or your frontend URL
    ACCESS_TOKEN_SECRET="your_access_token_secret_key"
    REFRESH_TOKEN_SECRET="your_refresh_token_secret_key"
    TOKEN_SECRET_KEY="your_email_verification_and_reset_token_secret_key" # Can be same as ACCESS_TOKEN_SECRET or different
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASSWORD="your_email_app_password" # For Gmail, use an App Password
    EMAIL_FROM="Querymind <your_email@gmail.com>"
    GEMINI_API_KEY="your_openai_api_key"
    GEMINI_MODEL="gemini-1.5-flash" # Or "gemini-1.5-pro", etc.
    ```

    **Note**: For `EMAIL_PASSWORD` with Gmail, you'll need to generate an "App password" from your Google Account security settings if you have 2-Step Verification enabled.

## ▶️ Running the Application

To start the server, run the following command:

```bash
npm start
# OR
yarn start
```

## Server Information

The server typically runs on `http://localhost:3000` (or the PORT specified in your `.env` file).

## ⚙️ API Endpoints

All endpoints are prefixed with `/api/v1`.

---

## User Routes (`/api/v1/users`)

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` (Authenticated) - Logout user
- `POST /refresh-token` (Authenticated) - Refresh access token

### Email & Password Management

- `GET /verify-email/:token` - Verify email address
- `POST /forget-password` - Request password reset
- `POST /reset-password/:token` - Reset password

### User Management

- `POST /change-password` (Authenticated) - Change password
- `GET /current-user` (Authenticated) - Get current user info

---

## Conversation Routes (`/api/v1/conversations`)

All conversation routes require authentication.

- `POST /create-conversation` - Create new conversation
- `GET /get-conversations` - Get all conversations
- `GET /get-conversations/:id` - Get specific conversation
- `PATCH /update-conversions-title/:id` - Update conversation title
- `DELETE /delete-conversions/:id` - Delete specific conversation
- `DELETE /clear-all-conversations` - Clear all conversations

---

## Message Routes (`/api/v1/messages`)

All message routes require authentication.

- `POST /create-message/:conversationId` - Create new message
- `GET /get-message/:conversationId` - Get specific message
- `PATCH /edit-message/:messageId` - Update message
- `DELETE /delete-message/:messageId` - Delete message

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.
