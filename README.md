# VASCON Code Challenge

A full-stack vending machine system built with **NestJS** (Backend) and **Next.js/React** (Frontend). This solution provides role-based functionality where **Sellers** can manage products and **Buyers** can deposit coins and make purchases.

---

## 🧠 Project Overview

This project implements a vending machine API and web interface with the following core capabilities:

- Role-based access control (`buyer`, `seller`)
- Product management (CRUD for sellers)
- Coin deposit, purchase, and change calculation
- JWT-based authentication
- Session management with multi-device awareness
- Fullstack architecture using modern technologies

---

## 📁 Project Structure

vascon-code-challenge/
├── backend/ # NestJS backend
│ ├── src/
│ └── ...
├── frontend/ # React/Next.js frontend
│ ├── pages/
│ └── ...
└── README.md

---

## 🚀 Technologies Used

### Backend (NestJS)

- NestJS + Express
- MySQL (raw SQL)
- Redis (for session management)
- JWT Authentication
- Jest (unit testing)

### Frontend (Next.js / React)

- Next.js
- Context API
- CSS Modules
- Axios

---

## 🔐 User Roles

| Role   | Capabilities                               |
| ------ | ------------------------------------------ |
| Seller | Create, update, delete products            |
| Buyer  | Deposit coins, buy products, reset deposit |

---

## 📦 Backend API Features

- User Registration & Authentication
- CRUD for Products (`seller` only)
- Deposit Coins (`buyer` only)
- Buy Products (`buyer` only)
- Reset Deposit (`buyer` only)
- Session Management (Force logout other sessions)
- Authenticated Endpoints (except `/user/register` and product `GET`)

---

## 🔧 How to Run the Project


### Prerequisites

- Node.js (v18+)
- MySQL
- Redis

---

### Backend

```bash
cd backend
npm install
# Setup .env for MySQL, Redis, JWT keys
npm run start:dev

### Frontend
cd frontend
npm install
npm run dev

🧪 Tests
Backend includes unit tests for:

/deposit

/buy

Product CRUD

Run tests using:
cd backend
npm run test

🌐 API Endpoints
Method	Endpoint	Auth	Role	Description
POST	/user/register	❌	Public	Register a new user
POST	/user/login	❌	Public	Login and receive JWT
POST	/product	✅	Seller	Add a new product
PUT	/product/:id	✅	Seller	Update product (by creator only)
DELETE	/product/:id	✅	Seller	Delete product (by creator only)
GET	/product	❌	Public	View all products
POST	/deposit	✅	Buyer	Deposit coins (5,10,20,50,100)
POST	/buy	✅	Buyer	Buy product, receive change
POST	/reset	✅	Buyer	Reset deposit to 0
POST	/logout/all	✅	All	Terminate all active sessions

⚠️ Edge Cases Considered
Insufficient deposit on purchase

Product out of stock

Invalid coin denominations

Session hijacking / multi-login enforcement

Unauthorized access to restricted resources

🧪 Postman Collection
A Postman collection is available locally for validating all endpoints. Please request it during code review or testing.

📌 Bonus Feature
🔄 Multi-device session detection and termination (/logout/all)

🛡️ Strong focus on access control and endpoint protection

⏱️ Timeline
Total time for completion: 7 days
Make sure to have the project running locally and a working Postman setup for demonstration.

📫 Contact
For any issues or clarifications, feel free to open an issue or reach out via GitHub.

```
