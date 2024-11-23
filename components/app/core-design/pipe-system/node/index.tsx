import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/components/store/store';
import { toast } from 'react-toastify';
import {
  addUseNode,
  updateUseNode,
  deleteUseNode,
  submitNodes,
  updateSupplyNode,
  validateNodes,
} from '@/components/store/slices/nodeSlice';
import Label from '@/components/authentication/ui/label';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

interface NodeProps {
  onBack?: () => void;
  onNext?: () => void;
}

const Node: React.FC<NodeProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { supplyNode, useNodes, status, error, isValid } = useSelector(
    (state: RootState) => state.node,
  );
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handleDeleteOrClear = (index: number) => {
    if (useNodes.length === 1) {
      dispatch(
        updateUseNode({
          index,
          node: { x: null, y: null, z: null },
        }),
      );
    } else {
      dispatch(deleteUseNode(index));
    }
  };

  const handleSubmit = async () => {
    dispatch(validateNodes());

    if (!isValid) {
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('error-border');
        setTimeout(() => {
          formContainerRef.current?.classList.remove('error-border');
        }, 1000);
      }
      return;
    }

    try {
      const result = await dispatch(submitNodes()).unwrap();
      if (result) {
        onNext?.();
      }
    } catch (error) {
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('error-border');
        setTimeout(() => {
          formContainerRef.current?.classList.remove('error-border');
        }, 1000);
      }
    }
  };

  return (
    <div className="node-container building-information-container">
      <div className="title">
        <h2>Node Information</h2>
        <p>Enter the building information below</p>
      </div>

      <div ref={formContainerRef} className="form-container">
        <div className="form">
          <div className="field-title">Supply Node</div>
          <div className="supply-node">
            {['x', 'y', 'z'].map((coord) => (
              <div key={coord} className="field">
                <Label value={coord} />
                <span>
                  <input
                    type="number"
                    placeholder={coord}
                    value={supplyNode[coord as keyof typeof supplyNode] || ''}
                    onChange={(e) =>
                      dispatch(
                        updateSupplyNode({
                          [coord]: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }),
                      )
                    }
                  />
                </span>
              </div>
            ))}
          </div>

          <div className="field-title">Use Nodes</div>
          {useNodes.map((node, index) => (
            <div key={index} className="use-node supply-node">
              {['x', 'y', 'z'].map((coord) => (
                <div key={coord} className="field">
                  <Label value={`${coord}${index + 1}`} />
                  <span>
                    <input
                      type="number"
                      placeholder={coord}
                      value={node[coord as keyof typeof node] || ''}
                      onChange={(e) =>
                        dispatch(
                          updateUseNode({
                            index,
                            node: {
                              [coord]: e.target.value
                                ? Number(e.target.value)
                                : null,
                            },
                          }),
                        )
                      }
                    />
                  </span>
                </div>
              ))}
              <div
                className="delete"
                onClick={() => handleDeleteOrClear(index)}
                title={useNodes.length === 1 ? 'Clear fields' : 'Delete node'}
              >
                <img
                  src="../../images/icons/delete.svg"
                  alt={useNodes.length === 1 ? 'Clear' : 'Delete'}
                />
              </div>
            </div>
          ))}

          <button className="add-more" onClick={() => dispatch(addUseNode())}>
            <img src="../../images/icons/add-grad.svg" alt="" />
            Add Another Use Node
          </button>
        </div>
      </div>

      <div className="cta">
        <button id="prev" onClick={onBack} disabled={status === 'loading'}>
          Back
        </button>
        <button
          id="next"
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <img src="../../images/icons/loading.svg" alt="Loading..." />
          ) : (
            'Proceed'
          )}
        </button>
      </div>
    </div>
  );
};

export default Node;
