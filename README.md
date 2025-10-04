# Portfolio Website Backend

Backend server for managing projects, experiences, and admin authentication for the portfolio website of **Deepak Bhandari**. Provides secure APIs for admin users to manage content displayed on the frontend React application.

## Features

- **Admin Dashboard (Backend APIs):**
  - Add, update, delete projects
  - Add, update, delete professional experiences
- **Authentication:**
  - Secure admin login/logout
  - Session-based authentication for protected routes
- **File Uploads:**
  - Upload project images
  - Upload company logos for experiences
- **RESTful APIs:** Clean, structured endpoints for frontend integration
- **Error Handling & Validation:** Handles invalid inputs and file types
- **CORS Enabled:** Ready for frontend consumption

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** Session-based or JWT (depending on setup)  
- **File Handling:** Multer for image uploads  
- **Environment Management:** dotenv  

## Getting Started

### Prerequisites

- Node.js and npm installed  
- MongoDB database (local or cloud)  

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/DpkBhandari/Portfolio-Website-backend.git
    cd Portfolio-Website-backend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    - Create a `.env` file in the root directory with:  
      ```env
      PORT=5000
      MONGO_URI=<your-mongodb-uri>
      JWT_SECRET=<your-secret-key>
      ```

4. **Run the server**
    ```bash
    npm run dev
    ```

### API Endpoints

#### Admin Authentication

- `POST /api/admin/login` — Login admin user  
- `POST /api/admin/logout` — Logout admin  
- `GET /api/admin/profile` — Check admin session  

#### Projects Management

- `GET /api/projects` — Fetch all projects  
- `POST /api/projects` — Add new project (admin only)  
- `PUT /api/projects/:id` — Update existing project (admin only)  
- `DELETE /api/projects/:id` — Delete project (admin only)  

#### Experience Management

- `GET /api/experience` — Fetch all professional experiences  
- `POST /api/experience` — Add new experience (admin only)  
- `PUT /api/experience/:id` — Update existing experience (admin only)  
- `DELETE /api/experience/:id` — Delete experience (admin only)  

### Screenshots / Demo

<!-- Add screenshots of Postman or API responses if desired -->

## Contributing

Contributions are welcome! Open an issue or submit a pull request to suggest improvements.

## License

[MIT](LICENSE)

---

**Developed & maintained by [Deepak Bhandari](https://github.com/DpkBhandari)**
