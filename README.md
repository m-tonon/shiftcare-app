# ShiftCare

A responsive staff scheduling platform for care teams, built to run on both desktop and mobile — optimized for phone use on the floor.

## Requirements

- Node.js 18+
- npm 9+

## Getting started

```bash
# Clone the repository
git clone https://github.com/your-user/shiftcare-app.git
cd shiftcare-app

# Install all dependencies (root + client + server)
npm run install:all

# Set up the database (first time only)
npm run db:init

# Start the development server
npm run dev
```

| Service | URL                   |
| ------- | --------------------- |
| Client  | http://localhost:5173 |
| Server  | http://localhost:3001 |

## Demo access

On the welcome screen you can use any name and the passphrase shown in the hint.

## Environment variables

Create `server/.env` before running:

```env
DATABASE_URL="file:./dev.db"
```

## AI scheduling assistant

The built-in chat understands natural language commands. Some examples:

| Command                                   | What it does                               |
| ----------------------------------------- | ------------------------------------------ |
| `fill the week`                           | Assigns staff to all open shifts this week |
| `fill monday morning`                     | Fills a specific shift                     |
| `need 3 nurses on saturday morning`       | Sets a staffing requirement                |
| `need 2 doctors on wednesday`             | Applies to all three shifts of that day    |
| `require 1 receptionist on weekend`       | Applies to Saturday and Sunday             |
| `swap Maria with James on monday morning` | Replaces one assigned worker with another  |
| `clear monday evening`                    | Removes all workers from that shift        |
| `clear overrides monday`                  | Resets custom rules, restores defaults     |
| `any gaps`                                | Lists all understaffed shifts this week    |
| `who is working tuesday`                  | Shows assignments for that day             |

## Database

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `npm run db:init`  | Creates tables and seeds demo data (first run) |
| `npm run db:reset` | Wipes all data and re-seeds from scratch       |

> `db:reset` runs `prisma db push --force-reset` followed by `prisma db seed` — no need to delete `dev.db` manually.
