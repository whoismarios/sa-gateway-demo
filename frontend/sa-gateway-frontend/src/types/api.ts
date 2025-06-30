export interface ApiResponse {
  data?: any;
  error?: string;
  status?: number;
  timestamp?: string;
}

export interface GraphQLField {
  id: string;
  name: string;
  query: string;
} 