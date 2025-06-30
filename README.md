# Confluencenter Story Map

An interactive story map application built with **Next.js**, **React**, **Leaflet**, and **Bootstrap**. It features a dynamic, responsive interface for exploring projects visually on a map.

**Live demo:** [https://adamfehse.github.io/map-app/](https://adamfehse.github.io/map-app/)

---

## Features

- Interactive map powered by **Leaflet** with markers for project locations.
- Dynamic project filtering and categorization.
- Responsive UI with **Bootstrap**
- Modals and accordions to display project information.
- Dark mode toggle.
- C# / ASP.NET Core - Backend API serving project data (JSON) dynamically.
- Data loaded from a local JSON file on the backend and exposed via a REST API endpoint.
- Frontend fetches project data from the backend API to ensure up-to-date information.

---

## Development & Deployment

- Frontend developed with Next.js and React.
- Backend API developed with .NET 6 minimal API.
- Data stored as JSON and served via `/api/projects` endpoint.
- To run locally:
  - Start backend server with `dotnet run` in the API project directory.
  - Run frontend with `npm run dev`.
- For production deployment:
  - Frontend can be built and deployed on GitHub Pages or some static host.
  - Backend API must be hosted separately to serve dynamic project data.
  - Frontend fetch URL should point to the hosted backend API.

---

## Notes

- SQLite or other databases can be added for scalable backend data storage if needed.
- API and frontend are loosely coupled; frontend can switch data sources by updating the fetch URL.

---

## Future Improvements

- Add authentication and authorization for managing project data.
- Integrate a cloud-hosted database.
- Implement offline caching for the frontend.
- Enhance map interactions and features/UI/UX.
- Integrate AI-powered analysis and project management features.

### Development Server

To run the project locally:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Editing the Project

Modify components in the `components/` directory to customize the app.

### Deployment

Deploy your application on **Vercel** for seamless hosting.

```bash
npm run build
```

## Technologies Used

- **Next.js**: React framework for server-side rendering, routing, and building the frontend.
- **React**: Component-based UI library powering the interactive interface.
- **Leaflet**: JavaScript library for interactive maps and markers.
- **Bootstrap**: CSS framework for responsive, mobile-first styling.
- **.NET 6 Minimal API**: Lightweight backend API serving project data dynamically.
- **C#**: Backend language used for API implementation.
- **JSON**: Data format used for project data storage and transmission.

## Project Structure

```
/components    # Reusable React components (Map, Sidebar, Modal, etc.)
/pages         # Next.js pages
/public        # Static assets like images and JSON data
/styles        # CSS and SCSS stylesheets
```

## License

This project is licensed under [MIT License](https://opensource.org/license/mit).

# El ChisMapa

## Overview
El ChisMapa is a modern, interactive map application for exploring borderlands stories, projects, and connections. It features a beautiful, glassy UI, dynamic project gallery, advanced search, and custom map overlays. The app is designed for both storytelling and data exploration, with a focus on usability and visual appeal.

## Tech Stack
- **React** (Next.js app directory)
- **Leaflet** (react-leaflet) for interactive mapping
- **Framer Motion** for smooth UI animations
- **Material-UI (MUI)** for sidebar and controls
- **Tailwind CSS** and custom CSS for modern, glassy styling
- **GeoJSON** for map data (projects, towns, borders)
- **GitHub Pages** for static hosting and data delivery

## Key Features
- Glassy, modern UI with dark mode
- Search bar with dropdown and project filtering
- Project gallery bar with animated connection lines
- Map legend and title styled for clarity and branding
- Town and city labels with improved readability
- Responsive design for desktop and mobile
- Modular component structure for easy extension

## Recent Improvements
- Unified glassy look for all overlays and dropdowns
- Fixed gallery bar scroll and legend interaction
- Improved town label visibility and style
- Tighter map bounds and zoom for better focus
- Sidebar toggle added to dropdown for quick access
- Fetches data from GitHub Pages for easy updates

## 🎯 Next Cool Features to Add
- Heatmap layer for project density
- Drawing tools for custom areas
- Geolocation to find user's location
- Route planning between projects
- 3D terrain with elevation data
- Custom map styles (satellite, terrain, etc.)

## How to Run
1. Clone the repo and install dependencies (`npm install`)
2. Start the dev server (`npm run dev`)
3. Open [http://localhost:3000](http://localhost:3000) in your browser

---
For more info or to contribute, see the codebase or contact the maintainer.

