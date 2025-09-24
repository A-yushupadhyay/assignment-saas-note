# SaaS Notes App

A full-stack **SaaS-style Notes application** built with **Next.js App Router**. This project demonstrates end-to-end development skills, including frontend, backend APIs, database integration, middleware, and deployment.

Live Demo - https://assignment-saas-note.vercel.app/


<img width="1920" height="1080" alt="Screenshot (123)" src="https://github.com/user-attachments/assets/c7ab3cb4-7f4d-4e99-b2de-ad1402efac38" />

<img width="1920" height="1080" alt="Screenshot (122)" src="https://github.com/user-attachments/assets/4d7bddd8-8938-45fd-8d87-674b2fe11245" />



---

## 🚀 Features

- **User Authentication**: Signup and login with JWT-based authentication.
- **Multi-Tenant Support**: Each user belongs to a tenant; notes are scoped per tenant.
- **CRUD Notes**: Create, read, update, and delete notes with tenant-level isolation.
- **Free & Pro Plans**: Tenant plans with note limits for Free users.
- **Server-Side APIs**: Built with Next.js App Router and server routes.
- **Middleware & CORS**: Handles cross-origin requests and preflight checks for production readiness.
- **Health Check Endpoint**: Monitor app status easily.
- **Database Integration**: Powered by Prisma ORM and PostgreSQL (Neon database).
- **Deployment Ready**: Optimized for deployment on Vercel.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js Server Routes, Prisma ORM
- **Database**: PostgreSQL (Neon), Prisma Client
- **Authentication**: JWT, bcrypt for password hashing
- **Hosting**: Vercel

---

## 📦 Installation & Setup

1. **Clone the repository**  
```bash
git clone https://github.com/your-username/saas-notes-app.git
cd saas-notes-app
```
Install dependencies
```

npm install
```


Set up environment variables
Create a .env file:
```

DATABASE_URL="postgresql://username:password@host:port/dbname?schema=public"
JWT_SECRET="your_long_secret_key"
```

Run Prisma migrations
```

npx prisma migrate dev --name init
```


Seed the database
```
npx ts-node prisma/seed.ts
```


Run the development server
```

npm run dev
```


Open http://localhost:3000
 in your browser.

📁 Project Structure
/app
  /api        # Next.js server routes
  /dashboard  # User dashboard
/lib
  auth.ts     # Authentication & JWT utilities
  prisma.ts   # Prisma client initialization
/prisma
  schema.prisma
  seed.ts     # Seed script for test accounts
/public
  assets      # Images & icons

🔑 Test Accounts
Email	Password	Role	Tenant
admin@acme.test
	password	Admin	Acme
user@acme.test
	password	Member	Acme
admin@globex.test
	password	Admin	Globex
user@globex.test
	password	Member	Globex
⚡ API Endpoints

POST /api/auth/login – Login user and receive JWT

POST /api/auth/signup – Create user & tenant

GET /api/notes – Get tenant notes

POST /api/notes – Create a new note

POST /api/tenants/[slug]/upgrade – Upgrade tenant to Pro (Admin only)

GET /api/health – Health check endpoint

💡 Highlights

App Router Ready: Full support for Next.js 13+ App Router.

Tenant-based Data Isolation: Multi-tenant SaaS architecture.

Secure Authentication: Passwords hashed with bcrypt and JWT-based auth.

Plan-based Features: FREE plan limits notes to 3 per tenant; PRO has no limits.

Production-Ready: CORS middleware included for cross-origin API requests.

Deployment: Zero-config deployment to Vercel.

🛠️ Future Improvements

Add real-time collaboration for notes using WebSockets or Pusher.

Enable rich text editing for notes.

Implement role-based access control for more granular permissions.

Add email notifications and reminders.


This project can be deployed seamlessly on Vercel.live deployment: 
```
https://assignment-saas-note.vercel.app/
```
📝 License

This project is open-source and available under the MIT License.


---
```
If you want, I can also make a **shorter, recruiter-friendly version** that highlights **full-stack skills, SaaS architecture, and App Router usage**, which is perfect for GitHub or portfolio links.
```

Author -> Ayush Updhyay




