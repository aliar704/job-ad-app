🧑‍💼 Job Ad App

An application designed for jobseekers and employers.

- Employers can post job ads and browse applicants' resumes.
- Jobseekers can apply to job ads using their resumes and manage their applications.
- Features include city management, job/company/tag management, resume upload, search, and more.

----------------------------

🛠️ Technologies & Tools Used

- **Winston** for logging all system events and errors in a structured way.
- **Jest** for writing unit tests across core services (`AuthService`, `UsersService`, `CompaniesService`, `JobAdsService`).
- **Joi** for validating request payloads using a centralized validation middleware.
- **Bcrypt** and **JWT** for secure authentication handling (password hashing and token generation).
- **Multer** along with a custom `uploadMiddleware` to handle file uploads for resumes (Only PDF).
- **Redis** was used for caching test purposes (e.g. for fetching cities list and companies list).
- **Custom Errors & Error Handling**: 
  - Custom error classes to define meaningful errors.
  - A controller wrapper to catch and forward errors.
  - A centralized error middleware to respond with proper error messages.

🧼 Data Normalization
- All input data is normalized before being passed to repositories to ensure type consistency and proper formatting.

🐘 PostgreSQL & Docker
- To connect to the PostgreSQL database and Redis:
  Run `docker-compose up`
- To initialize tables and relationships inside PostgreSQL (viewable via DataGrip):
  Run `npm run create-tables`

🔧 Running the App & Testing

To get started with this application, follow these commands:

- Run the app in development mode:
  npm run dev

- Run the unit tests:
  npm test

- Open the Swagger UI documentation in the terminal:
  npm run swagger

🧪 We have provided Swagger documentation for:
- Auth routes
- User routes

✅ Unit tests (written using Jest) are included for the following services:
- AuthService
- UsersService
- CompaniesService
- JobAdsService

----------------------------

It's a work in progress so we're sorry in advance if some parts are missing.

----------------------------

🌐 API Base URL

http://localhost:3500/api/

----------------------------

🔐 Auth Routes

POST /auth/signup  
Register a new user.  
Body:   
{
  "email": "string",
  "password": "string",
  "full_name": "string",
  "role": "jobseeker | employer",
  "phone": "string",
  "birth_date": "YYYY-MM-DD", 
  "city": "string | number"
}

POST /auth/login  
Login and receive a JWT token.  
Body:   
{
  "email": "string",
  "password": "string"
}

GET /auth/me  
Get the current logged-in user's profile.  
Headers: Authorization: Bearer <token>

----------------------------

🏙 Cities Routes

GET /cities  
Retrieve the list of all cities.

POST /cities (admin only)  
Add a new city.  
Body:   
{
  "name": "string",
  "country": "string (optional)"
}

DELETE /cities/:id (admin only)  
Hard delete a city by its ID.

----------------------------

🏢 Companies Routes

POST /companies (employer only)  
Create a new company.  
Body:  
{
  "name": "string",
  "description": "string (optional)",
  "website": "string (optional)",
  "phone": "string (optional)",
  "city": "string | number",
  "address": "string (optional)"
}

GET /companies  
Retrieve all companies.

GET /companies/user (employer only)  
Retrieve companies created by the current employer.

GET /companies/city  
Retrieve companies filtered by city (city name or city ID).  
Body:  
{
  "city": "string | number"
}

GET /companies/:id  
Retrieve a company by its ID.

PUT /companies/:id (employer only)  
Update company details.  
Body:  
{
  name: string (optional),
  description: string (optional),
  website: string (optional),
  phone: string (optional),
  city: string | number (optional),
  address: string (optional)
}

PUT /companies/delete/:id (employer or admin)  
Soft delete a company by its ID.

----------------------------

📢 Job Ads Routes

POST /jobads (employer only)  
Create a job ad.  
Body:  
{
  title: string,
  description: string,
  salary_min: number | null (optional),
  salary_max: number | null (optional),
  type: JobType,
  experience_level: XPLVL,
  company_id: number,
  tags: string[] | number[] | null (optional)
}

GET /jobads/user (employer only)  
Retrieve all job ads created by the logged-in employer.

GET /jobads/list  
Retrieve all job ads.

GET /jobads/applications/:id (employer only)  
Retrieve all applications for a specific job ad.

PUT /jobads/:id (employer only)  
Update a job ad.  
Body:  
{
  title: string (optional),
  description: string (optional),
  salary_min: number (optional),
  salary_max: number (optional),
  type: JobType (optional),
  experience_level: XPLVL (optional),
  company_id: number (optional),
  tags: string[] (optional)
}

PUT /jobads/delete/:id (employer only)  
Soft delete a job ad.

GET /jobads/top  
Retrieve top job ads.

----------------------------

📝 Applications Routes

POST /applications (jobseeker only)  
Submit an application for a job ad.  
Body:  
{
  job_ad_id: number,
  resume_id: number
}

GET /applications/list (jobseeker only)  
Retrieve a list of applications submitted by the user.

GET /applications (jobseeker only)  
Retrieve all applications with full job, resume, and company information.

PUT /applications/cancel/:id (jobseeker only)  
Cancel an application.

PUT /applications/status/:id (employer only)  
Change the status of an application.  
Body:  
{
  "status": "accepted | rejected | pending | cancelled"
}

GET /applications/top  
Retrieve top jobseekers based on application data.

----------------------------

📄 Resumes Routes

POST /resumes (jobseeker only)  
Upload a resume file.  
FormData (multipart/form-data):  
- resume: File (PDF or DOCX)  
- title: string  
- content: string

GET /resumes/list (jobseeker only)  
Retrieve a list of uploaded resumes.

PUT /resumes/:id (jobseeker only)  
Update a resume.  
Body:  
{
  title: string (optional),
  content: string (optional),
  file_url: string (optional)
}

PUT /resumes/delete/:id (jobseeker only)  
Soft delete a resume.

----------------------------

🔍 Search Route

GET /search  
Search job ads using query parameters (title, company, city, tags).  
Query format:  
{
  title: string (optional),  
  company: string (optional),  
  city: string (optional),  
  tags: string[] (optional)  
}

----------------------------

🏷 Tags Routes

POST /tags (employer or admin)  
Create a new tag.  
Body:  
{
  "name": "string"
}

GET /tags  
Retrieve all available tags.

DELETE /tags/:id (employer or admin)  
Delete a tag by its ID.

----------------------------

🏷 Job Tags Routes

POST /jobtags/:id (employer only)  
Add tags to a job ad.  
Body:  
{
  tags: string[] | number[]
}

GET /jobtags  
Retrieve all job tags.

GET /jobtags/:id
Retrieve a job ad with full tags name.

GET jobtags/list
Retrieve all job ads with their tags.

DELETE /jobtags/:id (employer only)  
Remove a tag from a job ad.


----------------------------

👤 Users Routes

GET /users (admin only)  
Retrieve list of all users.

GET /users/:id (admin only)  
Retrieve a user by ID.

PUT /users/update  
Update the logged-in user's information.  
Body:  
{
  full_name: string (optional),
  phone: string (optional),
  birth_date: Date (optional),
  city: string | number (optional)
}

PUT /users/delete  
Soft delete the current user.

PUT /users/delete/:id (admin only)  
Soft delete a user by ID.
