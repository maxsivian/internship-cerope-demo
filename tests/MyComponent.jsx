import { useState, useRef, useEffect } from 'react';
import styles from './MyComponent.module.css';

// Generating placeholder avatars using DiceBear
const AVATAR_COUNT = 13;
const COLS = 6;

// const generateAvatars = () => {
//   return Array.from({ length: AVATAR_COUNT }).map((_, i) => ({
//     id: i,
//     url: `https://api.dicebear.com/9.x/avataaars/svg?seed=Avatar${i + 15}&backgroundColor=transparent`,
//     label: `Avatar ${i + 1}`
//   }));
// };


const generateAvatars = () => {
  return Array.from({ length: AVATAR_COUNT }).map((_, i) => ({
    id: i,
    url: `/characters/c${i}.jpg`,
    label: `c${i}`
  }));
};

const avatarList = generateAvatars();

const ProfileSelector = () => {
  // State for the "Confirmed" avatar (displayed at top)
  const [currentAvatar, setCurrentAvatar] = useState(avatarList[0].url);
  
  // State for the temporary selection in the grid
  const [selectedId, setSelectedId] = useState(0);
  
  // State to toggle the dropdown visibility (optional, based on UI)
  const [isOpen, setIsOpen] = useState(true);

  const gridRef = useRef(null);

  // Handle keyboard navigation inside the grid
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    let nextId = selectedId;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextId = (selectedId + 1) % AVATAR_COUNT;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextId = (selectedId - 1 + AVATAR_COUNT) % AVATAR_COUNT;
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Move down one row (add columns count), wrap around if needed
        nextId = (selectedId + COLS) % AVATAR_COUNT;
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Move up one row
        nextId = (selectedId - COLS + AVATAR_COUNT) % AVATAR_COUNT;
        break;
      case 'Enter':
        e.preventDefault();
        confirmSelection();
        return;
      default:
        return;
    }

    setSelectedId(nextId);
  };

  const confirmSelection = () => {
    const selectedObj = avatarList.find(a => a.id === selectedId);
    if (selectedObj) {
      setCurrentAvatar(selectedObj.url);
      // Optional: Focus button or close dropdown here
    }
  };

  // Focus the grid container when opened to capture keys immediately
  useEffect(() => {
    if (isOpen && gridRef.current) {
      gridRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={styles.container}>
      {/* Top Current Avatar */}
      <div className={styles.currentAvatarWrapper}>
        <img 
          src={currentAvatar} 
          alt="Current Profile" 
          className={styles.currentAvatar} 
        />
      </div>

      <div className={styles.card}>
        {/* Header / Dropdown Trigger */}
        <div 
          className={styles.dropdownHeader} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Change Profile Picture</span>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {/* Avatar Grid */}
        {isOpen && (
          <div 
            className={styles.gridContainer}
            tabIndex={0} // Make div focusable for keyboard events
            onKeyDown={handleKeyDown}
            ref={gridRef}
            role="listbox"
            aria-label="Choose an avatar"
          >
            <div className={styles.grid}>
              {avatarList.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`${styles.avatarOption} ${selectedId === avatar.id ? styles.selected : ''}`}
                  onClick={() => setSelectedId(avatar.id)}
                  role="option"
                  aria-selected={selectedId === avatar.id}
                >
                  <img src={avatar.url} alt={avatar.label} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          className={styles.selectButton} 
          onClick={confirmSelection}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default ProfileSelector;