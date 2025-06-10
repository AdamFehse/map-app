# Story Map API

This is the backend API for the Story Map project, built with ASP.NET Core and SQLite.

## Setup Instructions

1. Install the .NET SDK (version 9.0 or later)
2. Install the Entity Framework Core tools:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

3. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd StoryMapApi
   ```

4. Create and apply the database migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. Import the initial data:
   ```bash
   curl -X POST http://localhost:5000/api/migration/migrate
   ```

6. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

- GET `/api/projects` - Get all projects
- GET `/api/projects/{id}` - Get a specific project by ID

## Development

The project uses SQLite as the database. The database file (`StoryMap.db`) will be created automatically when you run the migrations. This file is not committed to the repository and should be recreated on each environment where the application is deployed.

## Data Migration

The initial data is imported from `storymapdata_converted.json`. To reimport the data, use the migration endpoint:

```bash
curl -X POST http://localhost:5000/api/migration/migrate
``` 