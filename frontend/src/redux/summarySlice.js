import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    summaryList: [],
    summaryDetail: null,
    loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
        state.loading = 'failed';
    },
    setSummaryList: (state, action) => {
        state.summaryList = action.payload;
        state.loading = 'succeeded';
        state.error = null;
    },
    setSummaryDetail: (state, action) => {
        state.summaryDetail = action.payload;
        state.loading = 'succeeded';
        state.error = null;
    },
    updateSummaryDetail: (state, action) => {
        state.summaryDetail = action.payload;
        const index = state.summaryList.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
            state.summaryList[index] = action.payload;
        }
        state.loading = 'succeeded';
        state.error = null;
    }
  },
});

export const { 
    setLoading, 
    setError, 
    setSummaryDetail, 
    setSummaryList, 
    updateSummaryDetail 
} = summarySlice.actions;

const http = 'http://localhost:4000'

export const uploadSummary = (audioBlob) => {
  return async (dispatch) => {
    dispatch(setLoading('pending'));
    dispatch(setError(null));

    try {
      const formData = new FormData();
      formData.append("audioFile", audioBlob, "call_recording.webm");

      const response = await axios.post(`${http}/api/upload-and-process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newSummary = response.data.data;
      
      dispatch(setSummaryDetail(newSummary));
      
      return newSummary;
      
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload and process summary.";
      dispatch(setError(errorMessage));
    }
  };
};

export const fetchSummaries = () => {
  return async (dispatch) => {
    dispatch(setLoading('pending'));
    dispatch(setError(null));
    
    try {
      const response = await axios.get(`${http}/api/summaries`);
      
      dispatch(setSummaryList(response.data));
      
    } catch (error) {
      console.error("Fetch Summaries Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch summary list.";
      dispatch(setError(errorMessage));
    }
  };
};

export const fetchSummaryDetail = (summaryId) => {
  return async (dispatch) => {
    dispatch(setLoading('pending'));
    dispatch(setError(null));
    
    try {
      const response = await axios.get(`${http}/api/summaries/${summaryId}`);
      
      dispatch(setSummaryDetail(response.data));
      
    } catch (error) {
      console.error("Fetch Detail Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch summary details.";
      dispatch(setError(errorMessage));
    }
  };
};

export const updateStepStatus = (stepId) => {
  return async (dispatch) => {
    dispatch(setLoading('pending'));
    dispatch(setError(null));
    
    try {
      const response = await axios.put(`${http}/api/steps/${stepId}/complete`);

      const updatedSummary = response.data.summary;
      
      dispatch(updateSummaryDetail(updatedSummary));
      
    } catch (error) {
      console.error("Update Step Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update step status.";
      dispatch(setError(errorMessage));
    }
  };
};

export default summarySlice.reducer;