import { NotificationSettings } from './NotificationSettings';
import { DataExport } from './DataExport';
import './Settings.css';

interface SettingsProps {
  onExport: () => string;
  onImport: (data: string) => void;
}

export function Settings({ onExport, onImport }: SettingsProps) {
  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-sections">
        <section className="settings-section">
          <NotificationSettings />
        </section>

        <section className="settings-section">
          <DataExport onExport={onExport} onImport={onImport} />
        </section>
      </div>
    </div>
  );
}
