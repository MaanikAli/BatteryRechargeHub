# TODO: Implement Full Trashbin Functionality

## Tasks
- [x] Update Client.js model: add deleted field (Boolean, default false)
- [x] Update Transaction.js model: add deleted field (Boolean, default false)
- [x] Modify clients.js routes:
  - [x] Update GET / to filter out deleted clients
  - [x] Update GET /transactions to filter out deleted transactions
  - [x] Change DELETE /:id to soft delete (set deleted: true)
  - [x] Change DELETE /:id/transactions/:txId to soft delete
  - [x] Add GET /trash route to return deleted clients and transactions
  - [x] Add PUT /trash/:id/restore route to restore client
  - [x] Add PUT /trash/transactions/:txId/restore route to restore transaction
  - [x] Add DELETE /trash/:id route for permanent delete
- [ ] Test trashbin functionality

## Progress
- Backend implementation completed
