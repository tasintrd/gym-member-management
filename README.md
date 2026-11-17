# FitZone Gym Member Management System

A small CRUD assignment project built with HTML, CSS, Bootstrap, JavaScript, Node.js, Express and MySQL.

## Features

- **Create:** Add a gym member.
- **Read:** View all members in a table.
- **Update:** Edit a member's details.
- **Delete:** Delete a member after confirmation.
- Search members by name, email or phone.
- Dashboard counts for total, active and inactive members.

## Requirements

Install these before starting:

1. Node.js (LTS version)
2. MySQL Server (or XAMPP with MySQL)
3. A code editor such as VS Code

## Setup

### 1. Create the database

1. Start MySQL using MySQL Workbench or XAMPP.
2. Open `database/gym_management.sql` in MySQL Workbench, phpMyAdmin or another SQL client.
3. Execute the complete SQL file. It creates the `gym_management` database, the `members` table and three sample members.

### 2. Configure the database connection

1. In the project root, make a copy of `.env.example`.
2. Rename the copy to `.env`.
3. Update `DB_USER` and `DB_PASSWORD` to match your local MySQL setup.

Example for a local MySQL root account with no password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gym_management
PORT=3000
```

Do not upload your `.env` file to GitHub.

### 3. Install packages

Open a terminal in the project folder and run:

```bash
npm install
```

### 4. Start the project

```bash
npm start
```

You should see:

```text
Connected to MySQL database.
Gym Member Management is running at http://localhost:3000
```

Open this address in your browser:

http://localhost:3000

## Project structure

```text
gym_member_management/
├── database/
│   └── gym_management.sql
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── README.md
└── server.js
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/members` | Read all members |
| POST | `/api/members` | Create a member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |

## Database table

Table: `members`

| Column | Type | Description |
|---|---|---|
| id | INT, AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | Member's full name |
| email | VARCHAR(150) | Unique email |
| phone | VARCHAR(20) | Phone number |
| membership_type | ENUM | Monthly, Quarterly or Yearly |
| join_date | DATE | Joining date |
| status | ENUM | Active or Inactive |
| created_at | TIMESTAMP | Record creation time |

## How CRUD works in this project

1. The browser's JavaScript sends an HTTP request to the Express API.
2. Express receives the request in `server.js`.
3. The backend runs a MySQL query using the connection in `db.js`.
4. MySQL returns the result to the backend.
5. The backend sends a JSON response to the browser.
6. The frontend updates the member table.

**Important:** Browser JavaScript does not connect directly to MySQL. It communicates with the Node.js backend.

## Notes

- This is a learning/assignment project, not a production-ready gym system.
- Bootstrap is loaded from its CDN, so an internet connection is needed for Bootstrap styling and the modal.
- If MySQL connection fails, check that the MySQL service is running and `.env` contains the correct credentials.
