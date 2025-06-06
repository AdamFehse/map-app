# Confluencenter Story Map

An interactive story map application built with **Next.js**, **React**, **Leaflet**, and **Bootstrap**. It features a dynamic, responsive interface for exploring projects visually on a map.

**Live demo:** [https://adamfehse.github.io/map-app/](https://adamfehse.github.io/map-app/)

---

## Features

- Interactive map powered by **Leaflet** with markers for project locations.
- Dynamic project filtering and categorization.
- Responsive UI with **Bootstrap** styling.
- Modals and accordions to display detailed project information.
- Dark mode toggle for improved accessibility.
- Backend API built with **.NET 6** serving project data dynamically.
- Data loaded from a local JSON file on the backend and exposed via a REST API endpoint.
- Frontend fetches project data from the backend API to ensure up-to-date information.
- Deployment-ready static frontend with backend API dependency for dynamic data.
- Clear error handling for missing or invalid coordinates.

---

## Development & Deployment

- Frontend developed with Next.js and React.
- Backend API developed with .NET 6 minimal API.
- Data stored as JSON and served via `/api/projects` endpoint.
- To run locally:
  - Start backend server with `dotnet run` in the API project directory.
  - Run frontend with `npm run dev`.
- For production deployment:
  - Frontend can be built and deployed on GitHub Pages or any static host.
  - Backend API must be hosted separately (e.g., Azure, Render, or local server) to serve dynamic project data.
  - Frontend fetch URL should point to the hosted backend API.

---

## Notes

- Project data is currently public and contains no sensitive information.
- Backend API enforces camelCase JSON serialization to match frontend expectations.
- SQLite or other databases can be added for scalable backend data storage if needed.
- API and frontend are loosely coupled; frontend can switch data sources by updating the fetch URL.

---

## Future Improvements

- Add authentication and authorization for managing project data.
- Integrate a cloud-hosted database for scalability.
- Implement offline caching for the frontend.
- Enhance map interactions and clustering for large datasets.
- Integrate AI analysys and project managment.


### Development Server

To run the project locally:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Editing the Project

Modify components in the `components/` directory or pages in the `pages/` directory to customize the app.

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

