# Cinema Reservation System

A web-based cinema reservation system built with vanilla JavaScript and a mock REST API. Users can browse available screenings, make reservations, and manage their bookings, while administrators have full control over screenings and reservations.

## Technologies Used

- **Frontend:** Vanilla JavaScript (ES Modules), Vite, Tailwind CSS v4
- **Backend:** json-server (mock REST API)
- **Runtime:** Node.js

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd Reservacion-Cine

# Install Frontend dependencies
cd Frontend
npm install

# Install Api dependencies
cd ../Api
npm install
```

## Running the Project

```bash
# From the Frontend directory, start both Vite and json-server:
cd Frontend
npm run dev

# Or run them separately:
# Terminal 1 - Vite dev server
npx vite

# Terminal 2 - json-server (API)
cd ../Api
npx json-server db.json --port 3000
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## Running json-server

The database is located at `Api/db.json`. Start it on port 3000:

```bash
cd Api
npx json-server db.json --port 3000
```

## Test Users

| Email | Password | Role |
|---|---|---|
| admin@test.com | A123456 | Admin |
| user@test.com | A123456 | User |
| user2@test.com | A123456 | User |

## Project Structure

```
Reservacion-Cine/
├── Api/
│   ├── db.json              # JSON database (users, reservations, screenings)
│   └── package.json
├── Frontend/
│   ├── index.html            # Entry point
│   ├── vite.config.js        # Vite configuration with path aliases
│   ├── package.json
│   └── src/
│       ├── main.js           # App bootstrap
│       ├── style.css         # Tailwind CSS import
│       ├── router/
│       │   ├── router.js     # SPA router with auth guard
│       │   └── routes.js     # Route definitions
│       ├── views/
│       │   ├── homeView.js   # Main dashboard (reservations + panels)
│       │   ├── loginView.js  # Login page
│       │   └── notFound.js   # 404 page
│       ├── controllers/
│       │   ├── home.controller.js  # Reservation rendering & actions
│       │   └── login.controller.js
│       ├── components/
│       │   ├── ReservationCard.js   # Reservation card component
│       │   ├── ReservationModal.js  # Create/Edit reservation modal
│       │   ├── ScreeningModal.js    # Admin screening management
│       │   ├── CarteleraModal.js    # Movie listing modal
│       │   └── Sidebar.js          # Navigation sidebar
│       └── services/
│           ├── auth.service.js      # Session management (localStorage)
│           ├── reservation.service.js # Reservations CRUD API
│           ├── screening.service.js  # Screenings CRUD API
│           └── user.service.js       # Users API
└── README.md
```

## Role Permissions

### Admin
- View all reservations
- Approve / Cancel any reservation
- Edit any reservation
- Delete any reservation
- Create, edit, and cancel screenings
- Toggle management mode for quick actions

### User
- Browse the movie lineup (cartelera)
- Create reservations linked to a screening (automatic spot deduction)
- View only their own reservations
- Cancel reservations (only if approved and the screening hasn't started)
- Edit reservations (only if pending and the screening hasn't started)

## Data Model

### Screening
| Field | Type | Description |
|---|---|---|
| id | string | Unique identifier |
| movie | string | Movie title |
| room | string | Screening room (Sala A-D) |
| date | string | Screening date (YYYY-MM-DD) |
| startTime | string | Start time (HH:MM) |
| endTime | string | End time (HH:MM) |
| price | number | Ticket price |
| totalCapacity | number | Total seats |
| availableSpots | number | Remaining available seats |
| status | string | `activa` or `cancelada` |

### Reservation
| Field | Type | Description |
|---|---|---|
| id | string | Unique identifier |
| userId | string | Owner user ID |
| screeningId | string | Linked screening ID (optional) |
| movie | string | Movie name |
| workspace | string | Room name |
| date | string | Reservation date |
| startHour | string | Start time |
| endHour | string | End time |
| reason | string | Reason / notes |
| status | string | `pending`, `approved`, or `cancelled` |

## Technical Decisions

- **Vanilla JS over frameworks** — Keeps the project lightweight and avoids unnecessary dependencies for a single-page application of this scale.
- **json-server** — Provides a full REST API from a JSON file, ideal for rapid prototyping without a real database.
- **Vite** — Fast build tool with hot module replacement and native ESM support.
- **Tailwind CSS v4** — Utility-first CSS framework for rapid and consistent styling without custom CSS files.
- **localStorage for auth** — Simple session persistence without backend tokens; suitable for a demo application.
- **Event delegation** — Click handlers on the container element instead of individual card listeners, preventing memory leaks from re-renders.
- **Automatic spot tracking** — Screening `availableSpots` is decremented on reservation creation and incremented on cancellation, with re-verification at submit time to prevent overbooking.
