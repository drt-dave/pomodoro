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
	  setTags(JSON.parse(savedTags));
	}
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
	localStorage.setItem('pomodoroTags', JSON.stringify(tags));
  }, [tags]);

  const handleAddTag = () => {
	const trimmedTag = newTagName.trim();

	// Validation: check if tag name is not empty and doesn't already exist
	if (trimmedTag && !tags.includes(trimmedTag)) {
	  setTags([...tags, trimmedTag]);
	  setTag(trimmedTag);  // Automatically select the new tag
	  setNewTagName('');   // Clear the input
	  setShowAddTag(false); // Hide the input field
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
			className={`tag-btn ${t === tag ? 'active' : ''}`}
			onClick={() => handleSelectTag(t)}
			disabled={mode === 'break'}
		  >
			{t}
		  </button>
		))}
	  </div>

	  <div className="add-tag-section">
		{!showAddTag ? (
		  <button
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
			<button onClick={handleAddTag}>Add</button>
			<button onClick={() => {
			  setShowAddTag(false);
			  setNewTagName('');
			}}>
			  Cancel
			</button>
		  </div>
		)}
	  </div>
	</div>
  );
}

