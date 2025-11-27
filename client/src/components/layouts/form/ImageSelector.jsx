import { useState, useRef, useEffect, memo } from 'react';
import styles from './ImageSelector.module.css';

// Generating placeholder avatars using DiceBear
const AVATAR_COUNT = 13;
// const COLS = 6;

const generateAvatars = () => {
  return Array.from({ length: AVATAR_COUNT }).map((_, i) => ({
    id: i,
    url: `/characters/c${i}.jpg`,
    label: `c${i}`
  }));
};

const avatarList = generateAvatars();

const ProfileSelector = ({ avatar, setAvatar }) => {
  // State for the "Confirmed" avatar (displayed at top)
  // const [currentAvatar, setCurrentAvatar] = useState(avatarList[0].url);
  const [currentAvatar, setCurrentAvatar] = useState(avatarList[0].url);

  // console.log("currentAvatar", currentAvatar);

  useEffect(() => {
    if (avatar.picture) {
      setCurrentAvatar(avatar.picture)
      return
    }
    else {
      if (avatar.google_picture) {
        setCurrentAvatar(avatar.google_picture)
      }
    }
  }, [avatar.google_picture, avatar.picture])

  useEffect(() => {
    setAvatar({ ...avatar, current: currentAvatar })
  }, [currentAvatar])



  // State for the temporary selection in the grid
  const [selectedId, setSelectedId] = useState(null);

  // State to toggle the dropdown visibility (optional, based on UI)
  const [isOpen, setIsOpen] = useState(false);

  const gridRef = useRef(null);


  const confirmSelection = (e) => {
    e.preventDefault()
    if (selectedId == "google") {
      setCurrentAvatar(avatar.google_picture);
      return
    }
    // e.preventDefault()
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
          // src="https://lh3.googleusercontent.com/a/ACg8ocKybbtKFmMOKoi2EypBQJAj0tiGnDPKdMb86TkPKErm-1Pg5wM=s96-c"
          alt="Current Profile"
          className={styles.currentAvatar}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
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
            ref={gridRef}
            role="listbox"
            aria-label="Choose an avatar"
          >
            <div className={styles.grid}>
              {
                avatar.google_picture && (
                  <div
                    // key={avatar.id}
                    className={`${styles.avatarOption} ${selectedId === "google" ? styles.selected : ''}`}
                    onClick={() => setSelectedId("google")}
                    role="option"
                  // aria-selected={selectedId === avatar.id}
                  >
                    <img
                      src={avatar.google_picture}
                      alt={avatar.label}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )
              }

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
            <button
              className={styles.selectButton}
              onClick={confirmSelection}
            >
              Select
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default memo(ProfileSelector);