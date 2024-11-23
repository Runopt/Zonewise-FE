import React, { useState } from 'react';
import Navbar from '../navbar';
import Welcome from '../welcome-carousel';
import Link from 'next/link';

const HomeContainer = () => {
  const action = [
    {
      id: 0,
      link: '/core-design',
      icon: '../images/icons/civil.svg',
      title: 'Create Civil Engineer Design',
      desc: 'Zonewise - Intelligent Parking Analysis for Site Designers',
      url: '',
      className: 'action civil',
    },
    {
      id: 1,
      icon: '../images/icons/real-estate.svg',
      title: 'Create Real Estate Concept Design',
      desc: 'Zonewise - Intelligent Parking Analysis for Real Estate Developers',
      url: '',
      className: 'action real-estate',
    },
    {
      id: 2,
      icon: '../images/icons/import.svg',
      title: 'Import Existing Designs',
      desc: 'Zonewise - Intelligent Parking Analysis for Site Designers',
      url: '',
      className: 'action import',
    },
  ];

  const [showModal, setShowModal] = useState(false);

  // Dummy project data for non-empty state
  const projects = [
    {
      id: 1,
      coverImg: '../images/coverImg.svg',
      name: 'Project 1',
      description: 'A brief description of Project 1',
      tag: 'Zoning',
    },
    {
      id: 2,
      coverImg: '../images/coverImg.svg',
      name: 'Project 2',
      description: 'A brief description of Project 2',
      tag: 'Core Design',
    },
    {
      id: 3,
      coverImg: '../images/coverImg.svg',
      name: 'Project 3',
      description: 'A brief description of Project 2',
      tag: 'Core Design',
    },
  ];

  const handleSignUp = () => {
    // Your sign-up logic here
    setShowModal(true);
  };

  const totalProject = projects.length;

  return (
    <div className="home-container">
      <Navbar />
      <Welcome show={showModal} onClose={() => setShowModal(false)} />
      <div className="main">
        <div className="home-cta">
          {action.map((cta) => (
            <Link
              href={cta.link || '/default-link'}
              key={cta.id}
              className={cta.className}
            >
              <div className="icon">
                <img src={cta.icon} alt={cta.title} />
              </div>
              <div className="title">
                <h5>{cta.title}</h5>
                <p>{cta.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="projects-container">
          <div className="title-container">
            <div className="title">
              <h3>All Projects</h3>
              <span>{totalProject}</span>
            </div>
            <div className="show-mode">
              <div className="list">
                <img src="../images/icons/list-icon.svg" alt="List view" />
              </div>
              <div className="grid">
                <img src="../images/icons/grid-icon.svg" alt="Grid view" />
              </div>
            </div>
          </div>

          {totalProject === 0 ? (
            <div className="project-empty">
              <img
                src="../images/icons/empty-project.svg"
                alt="Empty Project"
              />
              <div className="desc">
                <h5>No Recent Projects Yet</h5>
                <p>
                  You can create a new Civil Engineer Design or create a new
                  Real Estate Concept Design.
                </p>
              </div>
              <div className="empty-project-cta">
                <button>
                  Create New Civil Engineer Design
                  <img src="../images/icons/add.svg" alt="Add" />
                </button>
                <button onClick={handleSignUp}>
                  Create New Real Estate Concept Design
                  <img src="../images/icons/add.svg" alt="Add" />
                </button>
              </div>
            </div>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <div key={project.id} className="project-item">
                  <img className="cover-img" src={project.coverImg} alt="" />

                  <div className="title">
                    <h5>{project.name}</h5>
                    <div className="tag">{project.tag}</div>
                  </div>

                  <p className="meta-desc">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
