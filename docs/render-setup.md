# Render setup (Web Service + PostgreSQL)

## 1) Fields to fill in **New Web Service**

- **Name**: `lucrabe-front`
- **Language**: `Node`
- **Branch**: `main`
- **Region**: `Oregon (US West)`
- **Root Directory**: *(leave empty)*
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Instance Type**: `Free`

## 2) Environment variables to add in Render

> Add these in the **Environment Variables** section. Keep secrets only in Render, never in git.

- `NODE_ENV=production`
- `DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>`
- `DB_SSLMODE=require`
- `ALLOWED_HOSTS=lucrabe-front.onrender.com`
- `CORS_ALLOW_ORIGINS=https://lucrabe-front.onrender.com`
- `CSRF_TRUSTED_ORIGINS=https://lucrabe-front.onrender.com`
- `GEMINI_API_KEY=<your_key>`

## 3) Mapping with your DB info

Given your values, the `DATABASE_URL` to paste in Render is:

`postgresql://lucrabe:<DB_PASSWORD>@dpg-d6kkeh75r7bs73e2o3vg-a.oregon-postgres.render.com/mondb_5rcv`

Use:

- `host`: `dpg-d6kkeh75r7bs73e2o3vg-a.oregon-postgres.render.com`
- `port`: `5432`
- `database`: `mondb_5rcv`
- `username`: `lucrabe`

## 4) Optional local connection test

```bash
PGPASSWORD='***' psql -h dpg-d6kkeh75r7bs73e2o3vg-a.oregon-postgres.render.com -U lucrabe mondb_5rcv
```

If you can connect with `psql`, Render should be able to connect once `DATABASE_URL` is set.
