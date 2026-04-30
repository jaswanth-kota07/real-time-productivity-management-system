import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await API.get('/tasks');
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
    try {
        const response = await API.post('/tasks', taskData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, taskData }, thunkAPI) => {
    try {
        const response = await API.put(`/tasks/${id}`, taskData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
    try {
        await API.delete(`/tasks/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        taskCreated: (state, action) => {
            if (!state.items.find(t => t._id === action.payload._id)) {
                state.items.push(action.payload);
            }
        },
        taskUpdated: (state, action) => {
            const index = state.items.findIndex(task => task._id === action.payload._id);
            if (index !== -1) state.items[index] = action.payload;
        },
        taskDeleted: (state, action) => {
            state.items = state.items.filter(task => task._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; })
            .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createTask.fulfilled, (state, action) => { 
                if (!state.items.find(t => t._id === action.payload._id)) {
                    state.items.push(action.payload);
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.items.findIndex(task => task._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(task => task._id !== action.payload);
            });
    },
});

export const { taskCreated, taskUpdated, taskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
