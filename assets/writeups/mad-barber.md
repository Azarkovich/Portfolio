# Mad Barber: Booking System

Secure appointment scheduling app built for an independent barber. Clients book available slots, the admin manages the calendar from his phone. Real use case, real deployment, real constraints.

[[ ./Source_Code ]](https://github.com/Azarkovich/Djims-Barber)

---

### ./Overview

A friend needed to stop managing appointments through DMs. The goal was straightforward: a public page where clients pick a time slot, and a mobile-friendly admin panel where he manages everything. No third-party SaaS, no monthly fees, no unnecessary features.

**Stack:**
- Backend: Python, FastAPI, SQLModel, PostgreSQL
- Frontend: HTML, CSS, Vanilla JS
- Auth: JWT (HS256), Argon2id
- Notifications: SMTP (primary), Brevo SMS (ready, opt-in)
- Scheduler: APScheduler (J-1 reminders, built into the server)
- Deployment: Render (API) + Netlify (frontend)

---

### ./Threat_Model

Three realistic threats for this type of application:

**Admin account takeover.** If someone gets in, they can read all client data, cancel reservations, manipulate the calendar. Primary threat.

**Slot spamming.** An automated script could reserve every available slot in seconds, making the calendar unusable without ever paying for an appointment.

**Client data exposure.** Names and phone numbers stored in the database represent personal data that must be protected at rest and in transit.

---

### ./Security_Implementation

**Password hashing: Argon2id**

bcrypt works. Argon2id is better. The memory-hard design makes GPU-based brute force attacks economically non-viable, which bcrypt does not guarantee. It is the current OWASP recommendation and took no additional implementation effort.

**JWT authentication**

Tokens signed with HS256, 60-minute expiry. The `SECRET_KEY` is loaded exclusively from environment variables. The application refuses to start if it is missing. No fallback default, no silent failure.

**Rate limiting via slowapi**

| Route | Limit |
|---|---|
| `POST /admin/login` | 5 req/min |
| `POST /reservations` | 3 req/min |
| `POST /admin/register` | 2 req/min |

The login limit makes dictionary attacks impractical. The reservation limit kills the slot-spamming vector. Both return `429 Too Many Requests` on breach.

**HTTP security headers**

Applied via FastAPI middleware on every response:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

**CORS policy**

Restricted to the frontend origin via environment variable. Wildcard `*` is never used in production. Only `GET`, `POST`, and `DELETE` methods are allowed.

**Secret management**

No secrets in source code. All credentials live in environment variables. `.env` is excluded from version control. `.env.example` documents required variables with empty values.

**Audit log**

Every sensitive action is written to `audit.log` with timestamp, action type, and source IP:

```
2026-07-03 10:24:01 | LOGIN_OK | username=djimmy | ip=82.x.x.x
2026-07-03 10:31:44 | LOGIN_FAILED | username=djimmy | ip=91.x.x.x
2026-07-03 10:31:45 | LOGIN_FAILED | username=djimmy | ip=91.x.x.x
```

Three consecutive failures from the same IP in two seconds is visible at a glance.

**Route hardening**

`POST /admin/register` is controlled via `REGISTER_ENABLED` environment variable. Set to `false` in production: the route returns `403` without touching the codebase.

---

### ./Test_Coverage

35 automated tests across four files:

```
tests/test_auth.py          : register, login, JWT validation, protected routes
tests/test_slots.py         : CRUD operations, auth requirements, past date filtering
tests/test_reservations.py  : full booking flow, double-booking rejection, cancellation
tests/test_security.py      : HTTP headers, rate limiting, expired/tampered tokens
```

Rate limiter state is reset between tests via `limiter._storage.reset()` in an `autouse` fixture, preventing false positives from shared in-memory state.

---

### ./Known_Limitations

**Phone number validation** is client-side only. A server-side regex on French mobile format would harden the input.

**Audit log rotation** is not implemented. `RotatingFileHandler` would prevent unbounded file growth in long-running production.

**JWT refresh tokens** are absent. The 60-minute expiry forces manual re-login, which is friction on mobile. A silent refresh mechanism would improve UX without compromising security.

---

### ./Takeaways

Security on a project of this scale does not require weeks of work. Argon2id, rate limiting, five HTTP headers, and proper secret management represent roughly two additional days on a project like this. The effort-to-protection ratio is high.

Building for a real user changes the approach. Every friction point in the admin UX is a real problem, not a theoretical one. The constraint of "must work on his phone between two clients" is as real as any security requirement.