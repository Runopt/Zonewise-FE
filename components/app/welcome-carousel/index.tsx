// components/Modal.js
import { useEffect, useState } from 'react';

const Welcome = ({ onClose, show }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'Optimized Grading and Drainage Design',
      description:
        'Runopt is transforming the civil engineering landscape with its AI-driven, fully integrated design optimization tool, delivering faster, cost-effective solutions.',
      image: '/images/icons/placeholder.svg',
    },
    {
      title: 'Another Feature',
      description: 'Runopt is transforming the civil engineering landscape with its AI-driven, fully integrated design optimization tool, delivering faster, cost-effective solutions.',
      image: '/images/icons/placeholder.svg',
    },
    {
      title: 'Another Feature',
      description: 'Runopt is transforming the civil engineering landscape with its AI-driven, fully integrated design optimization tool, delivering faster, cost-effective solutions.',
      image: '/images/icons/placeholder.svg',
    },
  ];

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" title="close" onClick={onClose}>
          <img src="../images/icons/close.svg" alt="" />
        </button>
        <div className="carousel">

          <div className="slide">
            <div className="slider-img">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
              />
            </div>

            <div className="slider-desc">
              <h5>{slides[currentSlide].title}</h5>
              <p>{slides[currentSlide].description}</p>
            </div>
          </div>
        </div>

        <div className="buttons">
          <button id="prev" onClick={prevSlide}>
            <img src="../images/icons/arrow-left-2.svg" alt="" />
            Prev
          </button>
          <button id="next" onClick={nextSlide}>
            Next
            <img src="../images/icons/arrow-right.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
