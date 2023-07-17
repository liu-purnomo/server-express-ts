# API Documentation

## User Routes

| Method | URL              | Description               | Requires Token |
| ------ | ---------------- | ------------------------- | -------------- |
| GET    | /                | Get all users             | No             |
| POST   | /register        | Register new user         | No             |
| POST   | /verify          | Verify user email         | No             |
| POST   | /resend-email    | Resend verification email | No             |
| POST   | /login           | Login user                | No             |
| PATCH  | /change-password | Change user password      | Yes            |
| PATCH  | /forgot-password | Forgot password           | No             |
| POST   | /reset-password  | Reset password            | No             |
| GET    | /profile         | Get user profile          | Yes            |
| GET    | /detail/:id      | Get user detail           | No             |
| PUT    | /update          | Update user detail        | Yes            |
