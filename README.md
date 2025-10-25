# Bookings API

A NestJS-based booking system for fitness classes.

## Requirements

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bookings
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your database credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=bookings_db
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   PORT=3000
   ```

4. **Setup database**
   - Create a PostgreSQL database named `bookings_db`
   - Make sure PostgreSQL is running on your system

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Run Tests

```bash
npm run test
npm run test:e2e
```

## Seed Data

The application includes seed data to populate the database with initial data for testing and development.

### How to Run Seeds

```bash
npm run seed:dev
```

### Seed Data Description

#### 1. Super Admin

- **Email**: `super@admin.com`
- **Password**: `password`
- **Role**: Super Admin
- **Name**: Super Admin

#### 2. Test User

- **Email**: `user@example.com`
- **Password**: `password`
- **Name**: User Example
- **Credits**: 0 (default)

#### 3. Sample Class

- **Name**: Pilates Class
- **Description**: A challenging pilates session
- **Instructor**: John Doe
- **Start Time**: 2025-10-24T11:00:00Z
- **End Time**: 2025-10-24T12:00:00Z
- **Capacity**: 20 students
- **Credits Required**: 100

### Login Credentials

Use these credentials to test the application:

**Super Admin:**

- Email: `super@admin.com`
- Password: `password`

**Regular User:**

- Email: `user@example.com`
- Password: `password`

### Notes

- Seeds only run if the respective tables are empty
- Duplicate seeds are skipped automatically
- All passwords are hashed before storage

## API Documentation

Once the application is running, you can access:

- **API Documentation**: `http://localhost:3000/api` (Swagger UI)
- **Health Check**: `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Classes

- `GET /classes` - Get all classes
- `POST /classes` - Create class (Admin only)
- `GET /classes/:id` - Get class by ID
- `PUT /classes/:id` - Update class (Admin only)
- `DELETE /classes/:id` - Delete class (Admin only)

### Bookings

- `POST /bookings` - Book a class
- `GET /bookings/my-bookings` - Get user bookings
- `GET /bookings/:id` - Get booking by ID
- `PUT /bookings/:id` - Cancel booking
- `GET /bookings` - Get all bookings (Admin only)

### Users

- `GET /users/profile` - Get user profile
- `PUT /users/credits` - Update user credits (Admin only)

## Quick Start

1. **Start the application**:

   ```bash
   npm run start:dev
   ```

2. **Run seeds**:

   ```bash
   npm run seed:dev
   ```

3. **Access the API**:
   - Open `http://localhost:3000/api` for Swagger documentation
   - Use the provided login credentials to test the API

## Troubleshooting

- **Database connection issues**: Check your PostgreSQL service and credentials
- **Port already in use**: Change the PORT in your `.env` file
- **Seeds not running**: Ensure the database is empty or check the console for errors
