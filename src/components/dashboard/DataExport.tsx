import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import './DataExport.css';

interface DataExportProps {
  onExport: () => string;
  onImport: (data: string) => void;
}

export function DataExport({ onExport, onImport }: DataExportProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    try {
      const data = onExport();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `momentum-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setImportStatus('success');
      setStatusMessage('Data exported successfully!');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      setImportStatus('error');
      setStatusMessage('Failed to export data');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        onImport(data);
        setImportStatus('success');
        setStatusMessage('Data imported successfully!');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (error) {
        setImportStatus('error');
        setStatusMessage('Invalid file format');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-export-container">
      <div className="export-header">
        <h2 className="export-title">Data Management</h2>
        <p className="export-subtitle">
          Export your data for backup or import from a previous backup
        </p>
      </div>

      <div className="export-actions">
        <div className="action-card">
          <div className="action-icon export-icon">
            <Download size={24} />
          </div>
          <div className="action-content">
            <h3 className="action-title">Export Data</h3>
            <p className="action-description">
              Download all your habits, completions, and achievements as a JSON file
            </p>
            <button className="btn btn-primary" onClick={handleExport}>
              <Download size={18} />
              Export to JSON
            </button>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon import-icon">
            <Upload size={24} />
          </div>
          <div className="action-content">
            <h3 className="action-title">Import Data</h3>
            <p className="action-description">
              Restore your data from a previously exported JSON file
            </p>
            <label className="btn btn-outline" htmlFor="import-file">
              <Upload size={18} />
              Import from JSON
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {importStatus !== 'idle' && (
        <div className={`status-message ${importStatus}`}>
          {importStatus === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
