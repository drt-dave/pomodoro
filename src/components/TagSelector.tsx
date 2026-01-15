import { useState, useEffect } from 'react';
import type { PomodoroMode } from '../types/pomodoro.types';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './TagSelector.module.css';

interface TagSelectorProps {
  tag: string;
  setTag: (tag: string) => void;
  mode: PomodoroMode;
}

export function TagSelector({ tag, setTag, mode }: TagSelectorProps) {
  const { translations } = useLanguage();
  const [tags, setTags] = useState<string[]>([translations.defaultTagGeneral, translations.defaultTagWork, translations.defaultTagStudy]);
  const [showAddTag, setShowAddTag] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');

  useEffect(() => {
	const savedTags = localStorage.getItem('pomodoroTags');
	if (savedTags) {
	  try {
	  const parsed = JSON.parse(savedTags) as string[];
	  setTags(parsed);
	  } catch {
		// Ignore parse errors - will use default tags
	  }
	}
  }, []);

  useEffect(() => {
	localStorage.setItem('pomodoroTags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
	if (!tag || tag.trim() === '') {
	  setTag('General');
	  return;
	}

	if (!tags.includes(tag)) {
	  setTags((prev) => [tag, ...prev]);
	}
  }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTag = () => {
	const trimmedTag = newTagName.trim();

	if (trimmedTag && !tags.includes(trimmedTag)) {
	  setTags([...tags, trimmedTag]);
	  setTag(trimmedTag);
	  setNewTagName('');
	  setShowAddTag(false);
	}
  };

  const handleSelectTag = (selectedTag: string) => {
	setTag(selectedTag);
  };

  return (
	<div className={styles.tagSelector}>
	  <h3>{translations.selectCategory}</h3>

	  <div className={styles.addTagSection}>
		{!showAddTag ? (
		  <button
			type="button"
			className={styles.addTagBtn}
			onClick={() => {
			  console.log('Vi alklakis butonon! (Add Tag)');
			  setShowAddTag(true);
			}}
			disabled={mode === 'break'}
		  >
			{translations.addTag}
		  </button>
		) : (
		  <div className={styles.addTagForm}>
			<input
			  type="text"
			  value={newTagName}
			  onChange={(e) => setNewTagName(e.target.value)}
			  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
			  placeholder={translations.tagPlaceholder}
			  autoFocus
			/>

			<button type="button" onClick={() => {
			  console.log('Vi alklakis butonon! (Add Tag - Confirm)');
			  handleAddTag();
			}}>
			  {translations.add}
			</button>

			<button
			  type="button"
			  onClick={() => {
				console.log('Vi alklakis butonon! (Add Tag - Cancel)');
				setShowAddTag(false);
				setNewTagName('');
			  }}
			>
			  {translations.cancel}
			</button>
		  </div>
		)}
	  </div>

	  <div className={styles.tagsList}>
		{tags.map((t) => (
		  <button
			key={t}
			type="button"
			className={[styles.tagBtn, t === tag ? styles.active : ''].join(' ')}
			onClick={() => {
			  console.log(`Vi alklakis butonon! (Tag: ${t})`);
			  handleSelectTag(t);
			}}
			disabled={mode === 'break'}
			aria-pressed={t === tag}
		  >
			{t}
		  </button>
		))}
	  </div>

	</div>
  );
}
