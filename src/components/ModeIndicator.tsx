import { usePomodoro } from '../hooks/PomodoroContext';

export const ModeIndicator = () => {
  const { mode } = usePomodoro();

  const modeConfig = {
    work: {
      icon: '💼',
      label: 'Work Session',
      className: 'mode-indicator--work'
    },
    break: {
      icon: '☕',
      label: 'Break Time',
      className: 'mode-indicator--break'
    }
  } as const;

  const config = modeConfig[mode];

  return (
    <div className={`mode-indicator ${config.className}`}>
      <span className="mode-indicator__icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="mode-indicator__label">
        {config.label}
      </span>
    </div>
  );
};
