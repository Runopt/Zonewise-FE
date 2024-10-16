import { useState, useRef, useEffect } from 'react';
import DataReferenceModal from './data-reference-modal';
import Navbar from '../navbar';

const ZoningContainer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isResponseActive, setIsResponseActive] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Set to true to open modal on page load
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tips = [
    {
      id: 0,
      icon: '../images/icons/routing.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
    {
      id: 1,
      icon: '../images/icons/magnet.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
    {
      id: 2,
      icon: '../images/icons/routing.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
  ];

  const resizePromptContainer = () => {
    const textarea = textareaRef.current;
    const promptContainer = document.querySelector(
      '.prompt-container',
    ) as HTMLElement;

    if (textarea && promptContainer) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      promptContainer.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.addEventListener('input', resizePromptContainer);
      resizePromptContainer();

      return () => {
        textarea.removeEventListener('input', resizePromptContainer);
      };
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    resizePromptContainer();

    if (selectedFile) {
      setIsModalOpen(true);
    }
  };

  const removeFile = () => {
    setFile(null);
    resizePromptContainer();
  };

  const handleSend = async () => {
    if (prompt.trim() === '') return;

    try {
      const response = await fetch('/api/submitPrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setResponse(data.response);
      setIsResponseActive(true);

      setPrompt('');
      resizePromptContainer();
    } catch (error) {
      console.error('Error sending prompt:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalContinue = (selectedOption: string) => {
    console.log('Selected Option:', selectedOption);
    setIsModalOpen(false);

    // Handle the selected option if needed
  };

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked((prev) => !prev);
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked((prev) => !prev);
  };

  return (
    <div className="zoning-container">
      <Navbar />

      <main className="main">
        {!isResponseActive && (
          <div className="start-content">
            <div className="desc">
              <h3>Start Zoning, Olakunbi!</h3>
              <p>
                Input the site location and type of proposed building​. <br />
                You can upload relevant document for the region to be searched
              </p>
            </div>

            <div className="tips-container">
              {tips.map((tip) => (
                <div className="tip" key={tip.id}>
                  <img src={tip.icon} alt="" />
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="prompt-container">
          <div className="pdf-container">
            <input
              type="file"
              id="upload"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <label id="upload" htmlFor="upload" className="upload-button">
              <img src="../images/icons/import.svg" alt="Upload PDF" />
              Upload PDF file
            </label>

            {file && (
              <div className="file-info">
                <img src="../images/icons/document.svg" alt="" />
                <p> {`${file.name.substring(0, 12)}...pdf`}</p>
                <button
                  onClick={removeFile}
                  title="Remove file"
                  className="remove-button"
                >
                  <img src="../images/icons/close.svg" alt="Remove" />
                </button>
              </div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            placeholder="Enter your questions here"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              resizePromptContainer();
            }}
          />

          <button id="send" title="send" onClick={handleSend}>
            <img src="../images/icons/arrow-up.svg" alt="Send" />
          </button>
        </div>

        {isResponseActive && (
          <div className="output-container">
            <div className="request-container">
              <div className="user-details">00</div>

              <div className="question-container">
                <div className="meta-data">You</div>
                <div className="question">
                  Tell me about the technology for street and off-street parking
                  in the document
                </div>
              </div>
            </div>
            <div className="response-container">
              <div className="details">
                <div className="app">
                  <div className="logo">
                    <img src="" alt="" />
                  </div>

                  <div className="main">
                    <div className="meta-data">Runopt</div>

                    <div className="response">{response}</div>
                  </div>

                  <div className="rate-response">
                    <button
                      className={`like ${isLiked ? 'active' : ''}`}
                      title="like response"
                      onClick={handleLike}
                    >
                      <img
                        src={`../images/icons/${
                          isLiked ? 'like-active' : 'like'
                        }.svg`}
                        alt=""
                      />
                    </button>

                    <button
                      className={`dislike ${isDisliked ? 'active' : ''}`}
                      title="dislike response"
                      onClick={handleDislike}
                    >
                      <img
                        src={`../images/icons/${
                          isDisliked ? 'dislike-active' : 'dislike'
                        }.svg`}
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <DataReferenceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onContinue={handleModalContinue}
      />
    </div>
  );
};

export default ZoningContainer;
