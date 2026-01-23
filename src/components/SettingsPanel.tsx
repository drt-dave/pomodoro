import { useState } from "react"; 
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({isOpen, onClose}: SettingsPanelProps) {
  const { translations: t } = useLanguage();
  const {
	workDuration,
	breakDuration,
	soundEnabled,
	setWorkDuration,
	setBreakDuration,
	setSoundEnabled,
	clearAllData
  } = useSettings();

  // Local state for form (in minutes for display)
  const [localWorkMinutes, setLocalWorkMinutes] = useState(workDuration / 60);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakDuration / 60);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => { 
	setWorkDuration(localWorkMinutes * 60);
	setBreakDuration(localBreakMinutes * 60);
	setSoundEnabled(localSoundEnabled);
	onClose();
  };

  const handleClearData = () => { 
	if ( showClearConfirm ) {
	  clearAllData();
	} else {
	  setShowClearConfirm(true);
	}
  }; 

  return (
	<div className={ styles.overlay } onClick={onClose}>
	  <div 
		className={ styles.panel }
		onClick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="settings-title"
	  >
		<h2 id="settings-title" className={ styles.title }>
		  {t.settingsTitle}
		</h2>
		<div className={ styles.settingGroup }>
		  <label className={ styles.label }>
			{t.workDuration} ({t.minutes})
		  </label>
		  <input 
			type="number" 
			min="1"
			max="60"
			value={ localWorkMinutes }
			onChange={(e)=> setLocalWorkMinutes(Number(e.target.value))}
			className={styles.input}
		  />
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.label } >
			{t.breakDuration} ({t.minutes})
		  </label>
		  <input 
			type="number" 
			min="1"
			max="30"
			value={localBreakMinutes}
			onChange={(e) => setLocalBreakMinutes(Number(e.target.value))}
			className={styles.input}
		  />
		</div>

		<div className={ styles.settingGroup }>
		  <label className={ styles.toggleLabel }>
			<span>{t.soundEffects}</span>
			<input 
			  type="checkbox" 
			  checked={localSoundEnabled}
			  onChange={(e) => setLocalSoundEnabled(e.target.checked)}
			  className={styles.checkbox}
			/>
			<span className={styles.toggleSwitch}></span>
		  </label>
		</div>

		<div className={ styles.divider }></div>
		<div className={ styles.settingGroup }>
		  <button 
			className={ styles.dangerButton }
			onClick={handleClearData}
		  >
			{showClearConfirm ? t.clearDataConfirm : t.clearData}

		  </button>
		</div>

		<div className={ styles.actions }>
		  <button 
			className={ styles.cancelButton }
			onClick={onClose}
		  >
			{t.close}
		  </button>
		  <button 
		  className={ styles.saveButton }
			onClick={handleSave}
		  >
			{t.save}
		  </button>
		</div>
	  </div>
	</div>
  );
}
