import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type FileState = {
  file: File | null;
  fileName?: string;
};

interface Question {
  id: number;
  text: string;
  response: string;
  fileState: FileState;
  loading: boolean;
  error: string | null;
}

interface PromptState {
  prompt: string;
  fileState: FileState;
}

interface Chat {
  id: number;
  title: string;
  questions: Question[];
  promptState: PromptState;
  isEmpty: boolean;
}

interface ZoningState {
  chats: Chat[];
  activeChatId: number | null;
  isModalOpen: boolean;
  isResponseActive: boolean;
  isLiked: boolean;
  isDisliked: boolean;
}

const initialState: ZoningState = {
  chats: [],
  activeChatId: null,
  isModalOpen: false,
  isResponseActive: false,
  isLiked: false,
  isDisliked: false,
};

const zoningSlice = createSlice({
  name: 'zoning',
  initialState,
  reducers: {
    addChat(
      state,
      action: PayloadAction<Omit<Chat, 'promptState' | 'isEmpty'>>,
    ) {
      const newChat: Chat = {
        ...action.payload,
        title: action.payload.title || `Chat ${state.chats.length + 1}`,
        promptState: {
          prompt: '',
          fileState: { file: null },
        },
        isEmpty: true,
      };
      state.chats.push(newChat);
      state.activeChatId = newChat.id;
      state.isResponseActive = false;
    },

    setPromptState(
      state,
      action: PayloadAction<{
        chatId: number;
        prompt: string;
        fileState: FileState;
      }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.promptState = {
          prompt: action.payload.prompt,
          fileState: action.payload.fileState,
        };
       
        chat.isEmpty = chat.questions.length === 0;
      }
    },

    addQuestionToChat(
      state,
      action: PayloadAction<{ chatId: number; question: Question }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        const isFirstQuestion = chat.questions.length === 0;
        chat.questions.push(action.payload.question);
        chat.isEmpty = false;
        chat.promptState = {
          
          prompt: '',
          fileState: { file: null },
        };
      
        if (isFirstQuestion) {
          chat.title = action.payload.question.text;
        }
      }
    },

    setActiveChat(state, action: PayloadAction<number>) {
      state.activeChatId = action.payload;
      const activeChat = state.chats.find((chat) => chat.id === action.payload);
      if (activeChat) {
        state.isResponseActive = !activeChat.isEmpty;
      }
    },

    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },

    setIsResponseActive(state, action: PayloadAction<boolean>) {
      state.isResponseActive = action.payload;
    },

    deleteChat(state, action: PayloadAction<number>) {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats.length ? state.chats[0].id : null;
        const newActiveChat = state.chats[0];
        state.isResponseActive = newActiveChat ? !newActiveChat.isEmpty : false;
      }
    },

    renameChat(
      state,
      action: PayloadAction<{ chatId: number; newTitle: string }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.title = action.payload.newTitle;
      }
    },

    setIsLiked(state, action: PayloadAction<boolean>) {
      state.isLiked = action.payload;
      if (action.payload) {
        state.isDisliked = false;
      }
    },

    setIsDisliked(state, action: PayloadAction<boolean>) {
      state.isDisliked = action.payload;
      if (action.payload) {
        state.isLiked = false;
      }
    },
  },
});

export const {
  addChat,
  setPromptState,
  addQuestionToChat,
  setActiveChat,
  setIsModalOpen,
  setIsResponseActive,
  deleteChat,
  renameChat,
  setIsLiked,
  setIsDisliked,
} = zoningSlice.actions;

export default zoningSlice.reducer;
