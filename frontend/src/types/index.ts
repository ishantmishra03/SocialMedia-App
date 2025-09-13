// ================== AUTH ==================
export interface User {
  _id: string;
  username: string;
  avatar?: string; 
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ================== POSTS ==================
export interface PostState {
  posts: IPost[];
  selectedPost: IPost | null;
  loading: boolean;
  error: string | null;
}

export interface IComment {
  _id: string;
  author: User;      
  post: string;       
  content: string;
  likes: string[];     
  createdAt: string;   
  updatedAt: string;
}

export interface IMedia {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw" | "audio" | string;
}

export interface IPost {
  _id: string;
  author: User;        
  content: string;
  media?: IMedia;
  likes: string[];     
  comments: IComment[];
  sharedFrom?: string; 
  createdAt: string;
  updatedAt: string;
}


// Profile Page
export interface IUser{
  username: string;
  avatar: string;
  bio: string;
  followers: User[];
  following: User[];
  savedPosts: IPost[];
  role: 'user' | 'admin';
}