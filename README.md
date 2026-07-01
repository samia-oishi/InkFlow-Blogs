# InkFlow

InkFlow is a modern Next.js blog platform for reading, searching, publishing, and managing blog posts. It uses Firebase for authentication/admin access and MongoDB for storing blog data, with demo API fallback support for blog browsing.

# Admin Login
scribe.oishi@gmail.com pass:Oishi123!
## Key Features

- Responsive landing page with featured blog posts and topic categories
- Blog listing page with search, category filtering, and publish date filtering
- Individual blog detail pages
- User authentication with login and registration pages
- Authenticated blog creation and editing
- User dashboard for tracking writing activity
- Personal blog management page for editing or deleting submissions
- Public writer profile management
- Admin moderation dashboard for approving, rejecting, deleting, and importing demo blogs
- MongoDB-backed API routes with Firebase-protected actions

## Setup & Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in the required values in `.env.local`:
   - Firebase web app config
   - Firebase Admin SDK credentials
   - MongoDB connection string and database name
   - Admin email list

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

6. Admin credentials: scribe.oishi@gmail.com
   Password: Oishi1!

7. User credentials: uxquery@gmail.com
   Password: Shimanto!

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production app
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Route Summary

### Page Routes

| Route              | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `/`                | Home page with hero section, featured blogs, categories, benefits, and testimonials |
| `/about`           | About page with project mission, vision, and team information                       |
| `/items`           | Blog library with search and filters                                                |
| `/items/[id]`      | Single blog detail page                                                             |
| `/items/add`       | Add blog page for authenticated users                                               |
| `/items/manage`    | Manage the current user's submitted blogs                                           |
| `/items/[id]/edit` | Edit an existing blog post                                                          |
| `/login`           | User login page                                                                     |
| `/register`        | User registration page                                                              |
| `/dashboard`       | Authenticated user dashboard                                                        |
| `/profile`         | Manage the current user's writer profile                                            |
| `/admin`           | Admin dashboard for blog moderation                                                 |

### API Routes

| Route                    | Methods                  | Description                                         |
| ------------------------ | ------------------------ | --------------------------------------------------- |
| `/api/blogs`             | `GET`, `POST`            | Fetch blogs or create a new blog                    |
| `/api/blogs/[id]`        | `GET`, `PATCH`, `DELETE` | Fetch, update, or delete a single blog              |
| `/api/my/blogs`          | `GET`                    | Fetch blogs submitted by the current user           |
| `/api/profile`           | `GET`, `PATCH`, `DELETE` | Fetch, update, or delete the current user's profile |
| `/api/admin/blogs`       | `GET`                    | Fetch blogs for admin moderation                    |
| `/api/admin/blogs/[id]`  | `PATCH`                  | Update moderation status for a blog                 |
| `/api/blogs/import-demo` | `POST`                   | Import demo blog data                               |
