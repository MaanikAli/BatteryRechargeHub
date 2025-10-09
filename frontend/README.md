# AMR Charging Hub Simulation

A full-stack application for simulating AMR charging hub operations, managing scenarios, and generating reports.

## Features

- **Simulation**: Run simulations with two parameters (param1 + param2).
- **Scenario Management**: Create, read, update, and delete scenarios.
- **Report Generation**: Generate PDF reports for scenarios.

## Tech Stack

- **Backend**: Node.js, Express, SQLite, PDFKit
- **Frontend**: React, TypeScript, Axios

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd amr-charging-hub
   ```

2. **Install backend dependencies**:
   ```
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```
   cd ..
   npm install
   ```

4. **Start the backend server**:
   ```
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000.

5. **Start the frontend development server**:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (or similar).

## Testing Instructions

1. **Simulation**:
   - Enter values for Param 1 and Param 2.
   - Click "Run Simulation" to see the result (sum of the two parameters).

2. **Scenarios**:
   - Add a new scenario by entering a name and parameters (JSON format).
   - View the list of scenarios.
   - Edit or delete existing scenarios.

3. **Report Generation**:
   - Click "Generate Report" next to a scenario to download a PDF report.

## API Endpoints

- `POST /simulate`: Run a simulation with param1 and param2.
- `GET /scenarios`: Get all scenarios.
- `POST /scenarios`: Create a new scenario.
- `PUT /scenarios/:id`: Update a scenario.
- `DELETE /scenarios/:id`: Delete a scenario.
- `POST /report/generate`: Generate a PDF report for a scenario.

## Database

The application uses SQLite for data persistence. The database file is created automatically on first run.
