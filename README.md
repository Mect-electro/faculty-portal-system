# Faculty Portal

A modern web application for managing faculty, student, and admin interactions within an educational institution.

## Features

- Role-based access control (Admin, Faculty, Student)
- Branch and class selection workflow
- Student management
- Calendar and event scheduling
- Document upload, management, and download
- Fully responsive design

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: TailwindCSS
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/faculty-portal.git
cd faculty-portal
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Execute the SQL migrations in the `supabase/migrations` directory
3. Set up storage bucket named `documents`
4. Configure Authentication to allow email/password sign-ins

## Demo Users

- **Admin**: admin@uni.com / password123
- **Faculty**: faculty@uni.com / password123
- **Student**: student@uni.com / password123

## Project Structure

```
faculty-portal/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility functions & API clients
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── supabase/
│   └── migrations/      # Database migrations
├── public/              # Static files
└── ...                  # Config files
```

## License

This project is licensed under the MIT License.