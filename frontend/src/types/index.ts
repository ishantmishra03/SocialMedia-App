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
