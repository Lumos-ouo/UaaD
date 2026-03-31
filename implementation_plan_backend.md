# Backend Core Foundations: Database Optimization & Anti-Spam (BE-02 & BE-03)

Our objective is to implement the first core features according to the `task_list.md` specification, advancing the backend from a basic mock prototype to a robust service tailored to handle high concurrency.

## 🎯 Proposed Changes

### 1. Database Connection Pool Optimization (BE-02)
We need to configure the Go database connection limits, avoiding overload and mitigating `database is locked` conflicts under concurrent conditions for our GORM client.
- **`backend/cmd/server/main.go`**: Extract the underlying `*sql.DB` object.
- Configure `SetMaxIdleConns`, `SetMaxOpenConns`, and `SetConnMaxLifetime` appropriately.

### 2. Registration Anti-Spam / Rate Limiting (BE-03)
We need to safeguard the `POST /api/v1/auth/register` route against spam creation using a robust rate-limiting strategy.
- **`backend/internal/middleware/rate_limit.go`** [NEW]: Create an IP-based in-memory rate limiter middleware utilizing `golang.org/x/time/rate`.
- **`backend/cmd/server/main.go`**: Inject the rate limiter to the `/register` endpoint so it blocks excessive incoming requests.

> [!WARNING]
> Because we aim to eventually transition to a purely distributed architecture, utilizing an in-memory rate limiter is a provisional approach. In the future, this should probably be backed by a Redis cluster via Lua scripting to synchronize limits across multiple pod replicas.

## ❓ Open Questions
- Do you want to continue utilizing **SQLite** for now, or should we switch the DDL and connection strategy to target **MySQL** / **PostgreSQL** immediately? 
- Should we use the rate limit package `golang.org/x/time/rate` or are there other strict dependencies you'd prefer for the rate limiter? 

## 🧪 Verification Plan
- **Unit/Integration Tests**: Write an automated test inside `backend/internal/handler/auth_test.go` or similar to spam the `/register` endpoint and verify HTTP 429 Too Many Requests.
- **Manual Verification**: Send concurrent curls to the register API and monitor response rejection rates and GORM's successful connection pooling usage without panics.
