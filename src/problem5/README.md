# Problem 5: ExpressJS + TypeScript CRUD Backend

This is a simple backend server built with ExpressJS, TypeScript, and Prisma (SQLite) for resource CRUD operations.

## Features
- Create a resource
- List resources (with name filter)
- Get resource details
- Update resource
- Delete resource

## Setup & Run

**Lưu ý:** Các lệnh dưới đây cần được thực hiện trong thư mục `src/problem5`. Bạn có thể chuyển vào thư mục này bằng:
```bash
cd src/problem5
```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migration:**
   ```bash
   npx prisma migrate dev --schema=prisma/schema.prisma
   ```

3. **Start the server (development):**
   ```bash
   npm run dev
   ```
   The server runs on [http://localhost:3001](http://localhost:3001)

4. **Build and run (production):**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `POST   /resources`         - Create a resource
- `GET    /resources`         - List resources (optional filter: `?name=...`)
- `GET    /resources/:id`     - Get resource details
- `PUT    /resources/:id`     - Update resource
- `DELETE /resources/:id`     - Delete resource

## Database
- Uses SQLite for local development (file: `prisma/dev.db`)
- Prisma schema: `prisma/schema.prisma`

## Notes
- All code is in TypeScript.
- You can use [Prisma Studio](https://www.prisma.io/studio) to view/edit data:
  ```bash
  npx prisma studio --schema=prisma/schema.prisma
  ```