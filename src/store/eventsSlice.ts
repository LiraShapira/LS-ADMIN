import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { SuccessApiResponse } from '../types/ApiTypes';
import { LSEvent } from '../types/EventTypes';
import { deleteEventInDB, fetchLSEventsData, saveEventToDatabase, updateEventInDatabase } from '../apiServices/EventsApi';
import { mockEvent1 } from '../mocks/mockEvents';

interface EventsState {
  events: LSEvent[];
  selectedEvent: LSEvent;
  isEditMode: boolean;
  deleteCounter: 0 | 1;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: mockEvent1,
  isEditMode: false,
  deleteCounter: 0
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
  SuccessApiResponse<LSEvent[]>,
  Partial<LSEvent>,
  { state: RootState }>
  ('eventsSlice/loadEvents', async (event): Promise<SuccessApiResponse<LSEvent[]>> => {
    const response = await updateEventInDatabase(event);
    if (!('data' in response)) {
      throw new Error(response.message);
    } else {
      return response;
    }
  });

export const deleteEvent = createAsyncThunk<
  SuccessApiResponse<LSEvent[]>,
  { id: string },
  { state: RootState }>
  ('eventsSlice/deleteEvent', async ({ id }): Promise<SuccessApiResponse<LSEvent[]>> => {
    const response = await deleteEventInDB({ id });
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
    },
    toggleDeleteCounter: (state) => {
      state.deleteCounter = state.deleteCounter === 0 ? 1 : 0;
    }
  }
});

export const selectSelectedEvent = (state: RootState) => state.eventState.selectedEvent;
export const selectEvents = (state: RootState) => state.eventState.events;
export const selectIsEditMode = (state: RootState) => state.eventState.isEditMode;
export const selectDeleteCounter = (state: RootState) => state.eventState.deleteCounter;
export const { setSelectedEvent, toggleDeleteCounter, setEvents, setIsEditMode } = eventsSlice.actions;

export default eventsSlice.reducer;
