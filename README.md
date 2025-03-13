# SoulSync Backend 💬🧠

SoulSync is an AI chat application designed to provide mental health support.

## Features ✨

- 🤖 AI-driven chat for mental health support
- 🔒 User authentication and authorization
- 🗄️ Secure data storage
- ⏱️ Real-time updates

## Installation 🛠️

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/SoulSync.git
    cd SoulSync/SoulSync_backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the necessary environment variables.
    ```env
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    ```

4. Run the server:
    ```sh
    npm start
    ```

## Usage 🚀

### API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `GET /api/user` - Get user data
- `POST /api/chat` - Start a chat session

### Example Requests

#### Register a new user
```sh
curl -X POST https://yourdomain.com/api/register -d '{
    "username": "example",
    "password": "password123"
}'
```

#### Login a user
```sh
curl -X POST https://yourdomain.com/api/login -d '{
    "username": "example",
    "password": "password123"
}'
```

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

## License 📄

This project is licensed under the MIT License.

