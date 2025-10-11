# TODO: Dashboard UI Improvements

## Task: Add hide/show toggles for Vehicle Types, Previous Due, and Client Dues Overview

### Steps:
- [x] Add new state variables for toggles: `showVehicleTypes` (default false), `showPreviousDue` (default false), `showDuesOverview` (default based on chartData).
- [ ] Add toggle buttons in JSX for each section (Vehicle Types, Previous Due column, Client Dues Overview).
- [ ] Compute "Previous Due" per client (simplified as sum of positive dues).
- [ ] Update Vehicle Types section rendering with conditional visibility.
- [ ] Update client list rows to conditionally show Previous Due column.
- [ ] Update Client Dues Overview rendering with conditional visibility.
- [ ] Test UI toggles and layout in browser.
- [ ] Run linter and verify no errors.
