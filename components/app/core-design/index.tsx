import React, { useState } from 'react';
import Navbar from '../navbar';
import SiteSurface from './site-surface';
import PipeSystem from './pipe-system';
import WaterSupply from './water-supply';
import SlopeStability from './slope-stability';

const CoreDesign = () => {
  const [activeTab, setActiveTab] = useState(0);

  const functionalities = [
    {
      id: 0,
      icon: '../images/icons/surface.svg',
      title: 'Site Surface',
      component: <SiteSurface />,
    },
    {
      id: 1,
      icon: '../images/icons/slope.svg',
      title: 'Slope Stability',
      component: <SlopeStability />,
    },
    {
      id: 2,
      icon: '../images/icons/water.svg',
      title: 'Water Supply',
      component: <WaterSupply />,
    },
    {
      id: 3,
      icon: '../images/icons/pipe.svg',
      title: 'Pipe System',
      component: <PipeSystem />,
    },
  ];

  return (
    <div className="core-design-container">
      <Navbar />

      <div className="main">
        <div className="functions">
          {functionalities.map((functions) => {
            return (
              <div
                className={`function ${
                  activeTab === functions.id ? 'active' : ''
                }`}
                key={functions.id}
                onClick={() => setActiveTab(functions.id)}
                role="button"
                tabIndex={0}
              >
                <img src={functions.icon} alt="" />
                <div className="title">{functions.title}</div>
              </div>
            );
          })}
        </div>

        <div className="content">{functionalities[activeTab].component}</div>
      </div>
    </div>
  );
};

export default CoreDesign;
