import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { IPost, PostState } from "@/types";

// Thunks
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/posts/user");
      return data.posts as IPost[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch posts");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}`);
      return data.data as IPost;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch post");
    }
  }
);


// Slice
const initialState: PostState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.error = null;
    },
    setSelectedPost: (state, action: PayloadAction<IPost | null>) => {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<IPost[]>) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(fetchUserPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch single post
    builder.addCase(fetchPostById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPostById.fulfilled, (state, action: PayloadAction<IPost>) => {
      state.loading = false;
      state.selectedPost = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
