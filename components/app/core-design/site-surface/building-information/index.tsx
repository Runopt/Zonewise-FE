import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Label from '@/components/authentication/ui/label';
import { RootState, AppDispatch } from '@/components/store/store';
import {
  addBuilding,
  updateBuilding,
  deleteBuilding,
  setEditingBuilding,
  submitBuildings,
} from '@/components/store/slices/buildingSlice';
import { selectUploadSessionId } from '@/components/store/slices/uploadSlice';

interface Building {
  name: string;
  length: string;
  width: string;
}

interface BuildingInformationProps {
  onBack: () => void;
  onNext: () => void;
}

const BuildingInformation: React.FC<BuildingInformationProps> = ({
  onBack,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { buildings, editingIndex, status } = useSelector(
    (state: RootState) => state.building,
  );

  const sessionId = useSelector(selectUploadSessionId);
  const [buildingName, setBuildingName] = useState('');
  const [buildingLength, setBuildingLength] = useState('');
  const [buildingWidth, setBuildingWidth] = useState('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const isSubmitting = status === 'loading';


  useEffect(() => {
    dispatch(setEditingBuilding(null));
  }, [dispatch]);


  useEffect(() => {
    if (status === 'succeeded') {
      onNext();
    }
  }, [status, onNext]);


  useEffect(() => {
    if (editingIndex !== null && buildings[editingIndex]) {
      const buildingToEdit = buildings[editingIndex];
      setBuildingName(buildingToEdit.name);
      setBuildingLength(buildingToEdit.length);
      setBuildingWidth(buildingToEdit.width);
    } else {
      resetForm();
    }
  }, [editingIndex, buildings]);

  const resetForm = () => {
    setBuildingName('');
    setBuildingLength('');
    setBuildingWidth('');
  };

  const validateBuilding = (name: string, length: string, width: string) => {
    if (!name.trim() || !length.trim() || !width.trim()) {
      toast.error('All building details must be filled in');
      return false;
    }
    return true;
  };

  const handleAddBuilding = () => {
    if (!validateBuilding(buildingName, buildingLength, buildingWidth)) return;

    if (editingIndex !== null) {
      dispatch(
        updateBuilding({
          index: editingIndex,
          building: {
            name: buildingName,
            length: buildingLength,
            width: buildingWidth,
          },
        }),
      );
      dispatch(setEditingBuilding(null));
    } else {
      dispatch(
        addBuilding({
          name: buildingName,
          length: buildingLength,
          width: buildingWidth,
        }),
      );
    }

  };

  const handleEditBuilding = (index: number) => {
    dispatch(setEditingBuilding(index));
  };

  const handleDeleteBuilding = (index: number) => {
    dispatch(deleteBuilding(index));
  };

  const handleSubmit = async () => {
     if (buildings.length === 0) {
       toast.error('Please add at least one building before submitting');
       return;
     }

     if (!sessionId) {
       toast.error('No session ID available. Please upload a file first.');
       return;
     }

     const requestBody = new URLSearchParams();
     requestBody.append('session_id', sessionId);
     requestBody.append('buildings_json', JSON.stringify(buildings));

     try {
       await dispatch(submitBuildings(requestBody)).unwrap();

     } catch (error) {
       console.error('Detailed Submission Error:', error);
     }
  };

  return (
    <div className="building-information-container">
      <div className="title">
        <h2>Buildings Information</h2>
        <p>Enter the building information below</p>
      </div>

      <div ref={formContainerRef} className="form-container">
        <div className="form">
          <div className="field">
            <Label value="Building Name" />
            <input
              type="text"
              placeholder="Enter building name"
              name="buildingName"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />
          </div>
          <div className="field">
            <Label value="Building length" />
            <span>
              <input
                type="number"
                placeholder="Enter building length"
                name="buildingLength"
                value={buildingLength}
                onChange={(e) => setBuildingLength(e.target.value)}
              />
              <div id="dimension">ft</div>
            </span>
          </div>

          <div className="field">
            <Label value="Building width" />
            <span>
              <input
                type="number"
                placeholder="Enter building width"
                name="buildingWidth"
                value={buildingWidth}
                onChange={(e) => setBuildingWidth(e.target.value)}
              />
              <div id="dimension">ft</div>
            </span>
          </div>
        </div>

        <button className="add" onClick={handleAddBuilding}>
          <img src="../../images/icons/add-black.svg" alt="Add" />
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="added-buildings">
        {buildings.map((building, index) => (
          <div key={index} className="added-building">
            <img
              className="file-icon"
              src="../../images/icons/buliding.svg"
              alt="Building"
            />
            <div className="building-info">
              <div className="building-name">{building.name}</div>
              <span>
                <div className="dimension">
                  <label htmlFor="length">Length: </label>
                  {building.length} ft
                </div>
                •
                <div className="dimension">
                  <label htmlFor="width">Width: </label>
                  {building.width} ft
                </div>
              </span>
            </div>

            <div className="added-building-cta">
              <div className="edit" onClick={() => handleEditBuilding(index)}>
                <img src="../../images/icons/edit.svg" alt="Edit" />
              </div>
              <div
                className="delete"
                onClick={() => handleDeleteBuilding(index)}
              >
                <img src="../../images/icons/delete.svg" alt="Delete" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cta">
        <button id="prev" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <img src="../../images/icons/loading.svg" alt="Loading..." />
          ) : (
            'Building Optimization'
          )}
        </button>
      </div>
    </div>
  );
};

export default BuildingInformation;
