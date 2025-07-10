
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
  isLoading?: boolean;
}

export interface Chat {
  id:string;
  title: string;
  messages: Message[];
  createdAt: number;
}
