import api from '../api/axios';

export const fetchTrips = () => api.get('/trips');

export const fetchTripById = (id) => api.get(`/trips/${id}`);

export const createTrip = (tripData) => api.post('/trips', tripData);

export const updateTrip = (id, tripData) => api.put(`/trips/${id}`, tripData);

export const deleteTrip = (id) => api.delete(`/trips/${id}`);
