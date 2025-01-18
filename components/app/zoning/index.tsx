import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import {
  setPromptState,
  addQuestionToChat,
  addChat,
  setIsModalOpen,
} from '@/components/store/slices/zoningSlice';
import DataReferenceModal from './data-reference-modal';
import ZoningSidebar from './sidebar';

const ZoningContainer: React.FC = () => {
  const dispatch = useDispatch();
  const [isUserActionOpen, setIsUserActionOpen] = useState(false);
  const userActionRef = useRef<HTMLDivElement>(null);
  const { chats, activeChatId, isModalOpen } = useSelector(
    (state: RootState) => state.zoning,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const hasInitialized = useRef(false); // Ref to track initialization

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (activeChatId) {
      dispatch(
        setPromptState({
          chatId: activeChatId,
          prompt: activeChat?.promptState.prompt || '',
          fileState: {
            file: selectedFile,
            fileName: selectedFile?.name,
          },
        }),
      );
      dispatch(setIsModalOpen(true));
    }
  };

  const handleSend = async () => {
    if (!activeChat?.promptState.prompt.trim()) {
      alert('Please enter a prompt before sending.');
      return;
    }

    try {
      const response = await fetch('/api/submitPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activeChat.promptState.prompt,
          fileName: activeChat.promptState.fileState.fileName,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();

      if (activeChatId && activeChat) {
        dispatch(
          addQuestionToChat({
            chatId: activeChatId,
            question: {
              id: Date.now(),
              text: activeChat.promptState.prompt,
              response: data.response,
              fileState: {
                file: activeChat.promptState.fileState.file,
                fileName: activeChat.promptState.fileState.fileName,
              },
              loading: false,
              error: null,
            },
          }),
        );
      }
    } catch (error) {
      console.error(error);
      alert('There was an error sending your prompt. Please try again.');
    }
  };

  useEffect(() => {
    // Guard to ensure addChat is called only once
    if (!hasInitialized.current && chats.length === 0) {
      dispatch(
        addChat({
          id: Date.now(),
          title: 'New Chat',
          questions: [],
        }),
      );
      hasInitialized.current = true; // Set the flag after dispatching
    }
  }, [chats, dispatch]);

  const shouldShowEmptyState =
    activeChat?.isEmpty && activeChat.questions.length === 0;
  const shouldShowOutputContainer =
    !activeChat?.isEmpty || activeChat?.questions.length > 0;

  const tips = [
    {
      id: 0,
      icon: '/images/icons/routing.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
    {
      id: 1,
      icon: '/images/icons/magnet.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
    {
      id: 2,
      icon: '/images/icons/routing.svg',
      desc: 'Determine the location of this zone for this size location....',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userActionRef.current &&
        !userActionRef.current.contains(event.target as Node)
      ) {
        setIsUserActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="zoning-container">
      <ZoningSidebar />

      <div className="user-actions-container">
        <div className="notification">
          <button title="notification">
            <img src="../images/icons/notification.svg" alt="" />
          </button>
        </div>

        <button
          className="user-profile-icon"
          onClick={() => setIsUserActionOpen(!isUserActionOpen)}
        >
          OO
        </button>
        {isUserActionOpen && (
          <div className="user-action" ref={userActionRef}>
            <button>Go Home</button>
            <button>Account Settings</button>
            <button>Logout</button>
          </div>
        )}
      </div>
      <main className="main">
        {shouldShowEmptyState && (
          <div className="empty-chat">
            <div className="desc">
              <h3>Welcome to Zoning!</h3>
              <p>Start by entering a prompt or uploading a file.</p>
            </div>

            <div className="tips-container">
              {tips.map((tip) => (
                <div className="tip" key={tip.id}>
                  <Image src={tip.icon} alt="" width={24} height={24} />
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {shouldShowOutputContainer && (
          <div className="output-container">
            {activeChat?.questions.map((q) => (
              <div key={q.id} className="response-item">
                <div className="request-container">
                  <div className="user-details">OO</div>
                  <div className="question-container">
                    <div className="meta-data">
                      <span>You</span>
                      {q.fileState.fileName && (
                        <span className="file-name">
                          {q.fileState.fileName}
                        </span>
                      )}
                    </div>
                    <div className="question">
                      <p>{q.text}</p>
                      {q.fileState.fileName && (
                        <div className="file-badge">
                          <img src="../images/icons/document.svg" alt="File" />
                          {q.fileState.fileName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="response-container">
                  <div className="details">
                    <div className="app">
                      <div className="main">
                        <div className="response">{q.response}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <label htmlFor="upload" className="upload-button">
              <Image
                src="/images/icons/import.svg"
                alt="Upload PDF"
                width={18}
                height={18}
              />
              Upload PDF
            </label>
            {activeChat?.promptState.fileState.fileName && (
              <div className="file-info">
                <img src="../images/icons/document.svg" alt="File" />
                <p>
                  {activeChat.promptState.fileState.fileName.length > 12
                    ? `${activeChat.promptState.fileState.fileName.slice(
                        0,
                        12,
                      )}...`
                    : activeChat.promptState.fileState.fileName}
                </p>
                <button
                  onClick={() =>
                    dispatch(
                      setPromptState({
                        chatId: activeChatId!,
                        prompt: activeChat.promptState.prompt,
                        fileState: { file: null },
                      }),
                    )
                  }
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
            value={activeChat?.promptState.prompt || ''}
            onChange={(e) =>
              dispatch(
                setPromptState({
                  chatId: activeChatId!,
                  prompt: e.target.value,
                  fileState: activeChat?.promptState.fileState || {
                    file: null,
                  },
                }),
              )
            }
          />

          <button
            id="send"
            title="send"
            onClick={handleSend}
            disabled={!activeChat?.promptState.prompt.trim()}
          >
            <Image
              src="/images/icons/arrow-up.svg"
              alt="Send"
              width={18}
              height={18}
            />
          </button>
        </div>
      </main>

      <DataReferenceModal
        isOpen={isModalOpen}
        onClose={() => dispatch(setIsModalOpen(false))}
        onContinue={() => dispatch(setIsModalOpen(false))}
      />
    </div>
  );
};

export default ZoningContainer;
