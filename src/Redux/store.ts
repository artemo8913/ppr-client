import { configureStore } from '@reduxjs/toolkit'
import pprDataReducer from './slice/pprDataSlice';
import pprUIReducer from './slice/pprUISlice';

const store = configureStore({
  reducer: {
    pprData: pprDataReducer,
    pprUI: pprUIReducer,
  }
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch