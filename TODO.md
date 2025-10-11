# TODO: Add Custom Previous Due Feature

## Backend Changes
- [x] Update Transaction model to make vehicleTypeId optional
- [x] Modify add transaction route to support custom payableAmount

## Frontend Changes
- [x] Update types.ts for optional vehicleTypeId in Transaction
- [x] Update api.ts addTransaction to accept optional payableAmount and vehicleTypeId
- [x] Add AddPreviousDueForm component in ClientProfile.tsx
- [x] Integrate AddPreviousDueForm into ClientProfile layout

## Testing
- [x] Test adding previous due and verify it updates total due
- [x] Ensure transaction history displays correctly
