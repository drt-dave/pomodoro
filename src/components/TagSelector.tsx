import { useState, useEffect } from 'react';
import type { PomodoroMode } from '../types/pomodoro.types';

interface TagSelectorProps {
  tag: string;
  setTag: (tag: string) => void;
  mode: PomodoroMode;
}

export function TagSelector({ tag, setTag, mode }: TagSelectorProps) {
  const [tags, setTags] = useState<string[]>(['General', 'Work', 'Study']);
  const [showAddTag, setShowAddTag] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');

  // Load tags from localStorage when component mounts
  useEffect(() => {
    const savedTags = localStorage.getItem('pomodoroTags');
    if (savedTags) {
      try {
        const parsed = JSON.parse(savedTags) as string[];
        setTags(parsed);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroTags', JSON.stringify(tags));
  }, [tags]);

  // Ensure the UI has a selected tag on mount.
  // If context provides a tag not present in tags list, add it so it can be shown as selected.
  // Also, if tag is empty, default to 'General'.
  useEffect(() => {
    if (!tag || tag.trim() === '') {
      setTag('General');
      return;
    }
    // If the current tag from context is not in the tags list, add it (so it can be shown active).
    if (!tags.includes(tag)) {
      setTags((prev) => [tag, ...prev]);
    }
    // We intentionally do not include `setTags` in deps to avoid duplicate additions;
    // `tags` is included above so this runs when tags change as well.
  }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTag = () => {
    const trimmedTag = newTagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTag(trimmedTag); // Automatically select the new tag
      setNewTagName('');
      setShowAddTag(false);
    }
  };

  const handleSelectTag = (selectedTag: string) => {
    setTag(selectedTag);
  };

  return (
    <div className="tag-selector">
      <h3>Select Category</h3>

      <div className="tags-list">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className={`tag-btn ${t === tag ? 'active' : ''}`}
            onClick={() => handleSelectTag(t)}
            disabled={mode === 'break'}
            aria-pressed={t === tag}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="add-tag-section">
        {!showAddTag ? (
          <button
            type="button"
            className="add-tag-btn"
            onClick={() => setShowAddTag(true)}
            disabled={mode === 'break'}
          >
            ➕ Add Tag
          </button>
        ) : (
          <div className="add-tag-form">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Tag name..."
              autoFocus
            />
            <button type="button" onClick={handleAddTag}>Add</button>
            <button
              type="button"
              onClick={() => {
                setShowAddTag(false);
                setNewTagName('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
