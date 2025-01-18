import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';
import {
  setActiveChat,
  addChat,
  deleteChat,
  renameChat,
} from '@/components/store/slices/zoningSlice';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/logo.svg';

const ZoningSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId } = useSelector(
    (state: RootState) => state.zoning,
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [activeOptionId, setActiveOptionId] = useState<number | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  const handleRename = (chatId: number) => {
    if (newTitle.trim()) {
      const truncatedTitle = truncateTitle(newTitle);
      dispatch(renameChat({ chatId, newTitle: truncatedTitle }));
    }
    setRenamingChatId(null);
    setActiveOptionId(null);
  };

  const handleDelete = (chatId: number) => {
    dispatch(deleteChat(chatId));
    setActiveOptionId(null);
  };

  const startNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      questions: [],
      promptState: { prompt: '', file: null },
      isEmpty: true,
    };
    dispatch(addChat(newChat));
  };

  const toggleOptions = (chatId: number) => {
    setActiveOptionId((prevId) => (prevId === chatId ? null : chatId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setActiveOptionId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`zoning-sidebar-container ${isCollapsed ? 'collapsed' : ''}`}
    >
      <div className="cont">
        <Link href="/home">
          <div className="logo">
            <Image src={Logo} alt="logo" width={100} height={36} />
          </div>
        </Link>

        <div
          className="sidebar-collapse-open-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Image
            src="/images/icons/expand.svg"
            alt="Expand icon"
            width={24}
            height={24}
          />
        </div>
      </div>

      <div className="start-new-chat">
        <button onClick={startNewChat}>
          New Chat
          <Image
            src="/images/icons/add.svg"
            alt="Add icon"
            width={16}
            height={16}
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="chat-history">
          <div className="title">Chat History</div>

          <div className="history">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  activeChatId === chat.id ? 'active' : ''
                }`}
                onClick={() => dispatch(setActiveChat(chat.id))}
              >
                {renamingChatId === chat.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleRename(chat.id)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleRename(chat.id)
                    }
                    placeholder="Enter new title"
                  />
                ) : (
                  <span>{truncateTitle(chat.title)}</span>
                )}

                <div
                  className="option"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOptions(chat.id);
                  }}
                >
                  <Image
                    src="/images/icons/option.svg"
                    alt="Options icon"
                    width={16}
                    height={16}
                  />
                </div>

                {activeOptionId === chat.id && (
                  <div className="options-container" ref={optionsRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingChatId(chat.id);
                        setNewTitle(chat.title);
                      }}
                      title="Rename chat"
                    >
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                      title="Delete chat"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoningSidebar;
