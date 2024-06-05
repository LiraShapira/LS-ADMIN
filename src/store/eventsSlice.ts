import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { SuccessApiResponse } from '../types/ApiTypes';
import { LSEvent } from '../types/EventTypes';
import { fetchLSEventsData, saveEventToDatabase, updateEventInDatabase } from '../apiServices/EventsApi';
import { mockEvent1 } from '../mocks/mockEvents';

interface EventsState {
  events: LSEvent[];
  selectedEvent: LSEvent;
  isEditMode: boolean;
  loading: boolean;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: mockEvent1,
  isEditMode: false,
  loading: false
};

export const loadEvents = createAsyncThunk<
  SuccessApiResponse<LSEvent[]>,
  undefined,
  { state: RootState }>
  ('eventsSlice/loadEvents', async (): Promise<SuccessApiResponse<LSEvent[]>> => {
    const response = await fetchLSEventsData();
    if (!('data' in response)) {
      throw new Error(response.message);
    } else {
      return response;
    }
  });

export const saveEvent = createAsyncThunk<
  SuccessApiResponse<LSEvent>,
  LSEvent,
  { state: RootState }>
  ('eventsSlice/loadEvents', async (event): Promise<SuccessApiResponse<LSEvent>> => {
    const response = await saveEventToDatabase(event);
    if (!('data' in response)) {
      throw new Error(response.message);
    } else {
      return response;
    }
  });

export const updateEvent = createAsyncThunk<
  SuccessApiResponse<LSEvent>,
  Partial<LSEvent>,
  { state: RootState }>
  ('eventsSlice/loadEvents', async (event): Promise<SuccessApiResponse<LSEvent>> => {
    const response = await updateEventInDatabase(event);
    if (!('data' in response)) {
      throw new Error(response.message);
    } else {
      return response;
    }
  });

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<LSEvent>) => {
      state.selectedEvent = action.payload;
    },
    setEvents: (state, action: PayloadAction<LSEvent[]>) => {
      state.events = action.payload;
    },
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadEvents.pending, state => {
        state.loading = true;
      })
      .addCase(loadEvents.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadEvents.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const selectSelectedEvent = (state: RootState) => state.eventState.selectedEvent;
export const selectEvents = (state: RootState) => state.eventState.events;
export const selectIsEditMode = (state: RootState) => state.eventState.isEditMode;
export const { setSelectedEvent, setEvents, setIsEditMode } = eventsSlice.actions;

export default eventsSlice.reducer;
