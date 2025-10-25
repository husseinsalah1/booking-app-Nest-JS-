# Bookings API

Booking classes system - Nest JS.

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
