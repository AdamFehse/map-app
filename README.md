# El ChisMapa

A modern, interactive story map application for exploring borderlands stories, projects, and connections. Built with **Next.js**, **React**, **Leaflet**, and featuring a beautiful glassy UI design.

**Live demo:** [https://adamfehse.github.io/map-app/](https://adamfehse.github.io/map-app/)

**Check out V2:** [https://github.com/AdamFehse/mapAppV2](https://github.com/AdamFehse/mapAppV2)

---

## Features

- **Interactive Mapping**: Powered by Leaflet with dynamic markers and project locations
- **Modern UI**: Glassy, responsive design with dark mode support
- **Smart Search**: Search bar with dropdown filtering and project discovery
- **Project Gallery**: Animated gallery bar with connection lines between projects
- **Dynamic Data**: Backend API serving project data via REST endpoints
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Advanced Filtering**: Project categorization and dynamic filtering options

---

## Tech Stack

- **Next.js**: React framework with app directory structure
- **React**: Component-based UI with react-leaflet for mapping
- **Leaflet**: Interactive maps and custom overlays
- **Framer Motion**: Smooth UI animations and transitions
- **Material-UI (MUI)**: Sidebar components and controls
- **Tailwind CSS**: Modern styling with custom glassy effects
- **C# / ASP.NET Core**: Backend API (.NET 6 minimal API)
- **JSON/GeoJSON**: Data format for projects, towns, and map overlays
- **GitHub Pages**: Static hosting and data delivery

---

## Getting Started

### Development Server

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Full Stack Development

- **Backend**: Start the API server with `dotnet run` in the API project directory
- **Frontend**: Run `npm run dev` for the Next.js development server
- **Data**: Projects are served via `/api/projects` endpoint

### Deployment

```bash
npm run build
```

Deploy on **Vercel** for seamless hosting or GitHub Pages for static deployment.

---

## Project Structure

```
/components    # Reusable React components (Map, Sidebar, Gallery, etc.)
/pages         # Next.js pages and API routes
/public        # Static assets, images, and JSON data
/styles        # CSS, SCSS, and Tailwind configurations
```

---

## Recent Improvements

- Unified glassy UI design across all components
- Enhanced search functionality with dropdown filtering
- Fixed gallery bar scroll and legend interactions
- Improved town label visibility and map styling
- Tighter map bounds and optimized zoom levels
- Responsive sidebar with toggle controls
- GitHub Pages integration for easy data updates

---

## Upcoming Features

- **Heatmap layer** for project density visualization
- **Drawing tools** for custom area selection
- **Geolocation** to find user's current location
- **Route planning** between project locations
- **3D terrain** with elevation data
- **Custom map styles** (satellite, terrain, street views)
- **Authentication** for project management
- **Cloud database** integration
- **Offline caching** capabilities
- **AI-powered analysis** and project insights

---

## Contributing

Modify components in the `components/` directory to customize the app. The frontend and backend are loosely coupled, making it easy to switch data sources by updating the fetch URL.

---

## License

This project is licensed under [MIT License](https://opensource.org/license/mit).

---

*For more info or to contribute, see the codebase or contact the maintainer.*
