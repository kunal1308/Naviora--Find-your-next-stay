# store/

Redux Toolkit store configuration and **global** slices (Phase 4).

- `store.ts` — `configureStore`, typed `RootState` / `AppDispatch`
- `hooks.ts` — typed `useAppSelector` / `useAppDispatch`
- slices for truly global state: `authSlice`, `themeSlice`

Feature-specific slices live inside their feature (e.g.
`features/booking/bookingSlice.ts`), not here. Only state shared across many
features belongs in this folder.

Note: server data (hotels, destinations) is handled by TanStack Query, **not**
Redux. Redux is for client/UI/global state only.
