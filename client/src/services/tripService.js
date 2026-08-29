import api from "../api/axios";

export const fetchTrips = () => api.get("/trips");

export const fetchTripById = (id) => api.get(`/trips/${id}`);

export const createTrip = (tripData) => api.post("/trips", tripData);

export const updateTrip = (id, tripData) =>
  api.put(`/trips/${id}`, tripData);

export const deleteTrip = (id) =>
  api.delete(`/trips/${id}`);

// Week 3 - Upload trip photo
export const uploadTripPhoto = (id, imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  return api.post(`/trips/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};