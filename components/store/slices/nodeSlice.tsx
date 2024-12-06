import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Node {
  x: number | null;
  y: number | null;
  z: number | null;
}

interface NodeState {
  supplyNode: Node;
  useNodes: Node[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  apiEndpoint: string;
  isValid: boolean;
  responseData?: {
    message: string;
    total_price: number;
    plot: string;
    paths: number[][][];
  };
}

const initialState: NodeState = {
  supplyNode: { x: null, y: null, z: null },
  useNodes: [{ x: null, y: null, z: null }],
  status: 'idle',
  error: null,
  apiEndpoint: 'http://54.90.88.209:8000/upload/select-nodes',
  isValid: false,
};

const validateNodeData = (
  supplyNode: Node,
  useNodes: Node[],
): { isValid: boolean; error: string | null } => {
  if (useNodes.length === 0) {
    return { isValid: false, error: 'Please add at least one use node' };
  }

  const isSupplyNodeComplete = Object.values(supplyNode).every(
    (val) => val !== null,
  );
  const isUseNodesComplete = useNodes.every((node) =>
    Object.values(node).every((val) => val !== null),
  );

  if (!isSupplyNodeComplete || !isUseNodesComplete) {
    return { isValid: false, error: 'Please fill in all node coordinates' };
  }

  return { isValid: true, error: null };
};

export const submitNodes = createAsyncThunk(
  'node/submitNodes',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { node: NodeState };
    const { supplyNode, useNodes, apiEndpoint } = state.node;

    const { isValid, error } = validateNodeData(supplyNode, useNodes);
    if (!isValid) {
      return rejectWithValue(error);
    }

    const payload = {
      supply_node: [supplyNode.x, supplyNode.y, supplyNode.z],
      use_nodes: useNodes.map((node) => [node.x, node.y, node.z]),
    };

    try {
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Console log the response
      console.log('API Response:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to submit nodes',
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    updateSupplyNode: (state, action: PayloadAction<Partial<Node>>) => {
      state.supplyNode = { ...state.supplyNode, ...action.payload };
      state.error = null;
      const { isValid, error } = validateNodeData(
        state.supplyNode,
        state.useNodes,
      );
      state.isValid = isValid;
      state.error = error;
    },

    addUseNode: (state) => {
      state.useNodes.push({ x: null, y: null, z: null });
      state.error = null;
      const { isValid, error } = validateNodeData(
        state.supplyNode,
        state.useNodes,
      );
      state.isValid = isValid;
      state.error = error;
    },

    updateUseNode: (
      state,
      action: PayloadAction<{ index: number; node: Partial<Node> }>,
    ) => {
      const { index, node } = action.payload;
      if (index >= 0 && index < state.useNodes.length) {
        state.useNodes[index] = { ...state.useNodes[index], ...node };
        const { isValid, error } = validateNodeData(
          state.supplyNode,
          state.useNodes,
        );
        state.isValid = isValid;
        state.error = error;
      } else {
        state.error = 'Invalid node index';
        state.isValid = false;
        toast.error('Error updating node');
      }
    },

    deleteUseNode: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.useNodes.length) {
        state.useNodes.splice(index, 1);
        const { isValid, error } = validateNodeData(
          state.supplyNode,
          state.useNodes,
        );
        state.isValid = isValid;
        state.error = error;
      } else {
        state.error = 'Invalid node index';
        state.isValid = false;
      }
    },

    validateNodes: (state) => {
      const { isValid, error } = validateNodeData(
        state.supplyNode,
        state.useNodes,
      );
      state.isValid = isValid;
      state.error = error;

      if (!isValid && error) {
        toast.error(error);
      }
    },

    resetNodeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitNodes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        toast.loading('Submitting nodes...');
      })
      .addCase(submitNodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.responseData = action.payload;
        toast.dismiss();
        toast.success('Nodes submitted successfully');
      })
      .addCase(submitNodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        toast.dismiss();
        toast.error(action.payload as string);
      });
  },
});

export const {
  updateSupplyNode,
  addUseNode,
  updateUseNode,
  deleteUseNode,
  validateNodes,
  resetNodeState,
} = nodeSlice.actions;

export default nodeSlice.reducer;
