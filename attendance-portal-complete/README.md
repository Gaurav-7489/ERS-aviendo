# Attendance Portal

This is a full-stack attendance portal (starter project) with:
- Backend: Express, MongoDB, JWT auth
- Frontend: React, Vite, Tailwind, react-three-fiber (3D welcome)

## Quick start (local)
1. Start MongoDB (e.g., `mongod` or use Atlas).
2. Backend:
   - cd backend
   - npm install
   - copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
   - node seedTeacher.js
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Open frontend (Vite) default port 5173.

Export from Teacher view will produce an Excel file using `xlsx` in the browser.






today i reached at login page the sign in button or skip login button is not working i have to make it working , next step to be continued...





today, i connected everything for a dev ready app, but the classroom server is yet to be added then , the tecehr view has to be fixed, (today i achieved mongodb, and good flow of landing page sign up student then dashboard),  next will be procedded later.