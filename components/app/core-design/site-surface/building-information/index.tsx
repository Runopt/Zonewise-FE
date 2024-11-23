import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '@/components/authentication/ui/input';
import Label from '@/components/authentication/ui/label';
import { RootState, AppDispatch } from '@/components/store/store';
import {
  addBuilding,
  updateBuilding,
  deleteBuilding,
  setEditingBuilding,
  submitBuildings,
} from '@/components/store/slices/buildingSlice';

interface Building {
  name: string;
  length: string;
  width: string;
}

interface BuildingInformationProps {
  onBack: () => void;
  onNext: () => void;
  onSubmit?: (buildings: Building[]) => void;
}

const BuildingInformation: React.FC<BuildingInformationProps> = ({
  onBack,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { buildings, editingIndex, status, currentBuilding } = useSelector(
    (state: RootState) => state.building,
  );
  const [buildingName, setBuildingName] = useState('');
  const [buildingLength, setBuildingLength] = useState('');
  const [buildingWidth, setBuildingWidth] = useState('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const isSubmitting = status === 'loading';

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
      setBuildingName('');
      setBuildingLength('');
      setBuildingWidth('');
    }
  }, [editingIndex, buildings]);

  const handleAddBuilding = () => {
    const buildingName = (
      document.querySelector('input[name="buildingName"]') as HTMLInputElement
    ).value;
    const buildingLength = (
      document.querySelector('input[name="buildingLength"]') as HTMLInputElement
    ).value;
    const buildingWidth = (
      document.querySelector('input[name="buildingWidth"]') as HTMLInputElement
    ).value;

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

    setBuildingName('');
    setBuildingLength('');
    setBuildingWidth('');
  };

  const handleEditBuilding = (index: number) => {
    dispatch(setEditingBuilding(index));
  };

  const handleDeleteBuilding = (index: number) => {
    dispatch(deleteBuilding(index));
  };

  const handleSubmit = () => {
    if (buildings.length === 0) {
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('error-border');

        setTimeout(() => {
          formContainerRef.current?.classList.remove('error-border');
        }, 1000);
      }
      return;
    }

    dispatch(submitBuildings(buildings));
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
          <img src="../../images/icons/add-black.svg" alt="" />
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="added-buildings">
        {buildings.map((building, index) => (
          <div key={index} className="added-building">
            <img
              className="file-icon"
              src="../../images/icons/buliding.svg"
              alt=""
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
                <img src="../../images/icons/edit.svg" alt="" />
              </div>
              <div
                className="delete"
                onClick={() => handleDeleteBuilding(index)}
              >
                <img src="../../images/icons/delete.svg" alt="" />
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
