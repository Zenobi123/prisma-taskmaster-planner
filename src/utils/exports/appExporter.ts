
import { saveAs } from 'file-saver';

/**
 * Exports all application data as a downloadable HTML file
 */
export const exportAppDataToHTML = () => {
  // Create a simple HTML template that includes the application data
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sauvegarde des données - TaskMaster Planner</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #2563eb;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }
    .data-container {
      margin-top: 20px;
    }
    pre {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 5px;
      overflow: auto;
      border: 1px solid #e5e7eb;
    }
    .date-info {
      color: #6b7280;
      font-style: italic;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Sauvegarde des données - TaskMaster Planner</h1>
  <div class="date-info">Exporté le ${new Date().toLocaleString('fr-FR')}</div>
  
  <div class="data-container">
    <h2>Données de l'application</h2>
    <pre id="app-data">${JSON.stringify(getAllAppData(), null, 2)}</pre>
  </div>

  <script>
    // Script pour permettre de restaurer les données ultérieurement
    const appData = ${JSON.stringify(getAllAppData())};
    
    // Function to restore data (placeholder)
    function restoreData() {
      console.log('Données prêtes pour restauration:', appData);
      // La restauration réelle nécessiterait une implémentation côté application
    }
  </script>
</body>
</html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `taskmaster-backup-${new Date().toISOString().split('T')[0]}.html`);
};

/**
 * Exports all application data as CSS file (data embedded in comments)
 */
export const exportAppDataToCSS = () => {
  const css = `
/* TaskMaster Planner - Sauvegarde des données */
/* Exporté le ${new Date().toLocaleString('fr-FR')} */
/* 
DATA_START
${JSON.stringify(getAllAppData())}
DATA_END
*/

body {
  /* Les données sont stockées dans le commentaire ci-dessus */
  font-family: Arial, sans-serif;
}
  `;

  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  saveAs(blob, `taskmaster-backup-${new Date().toISOString().split('T')[0]}.css`);
};

/**
 * Exports all application data as JS file
 */
export const exportAppDataToJS = () => {
  const js = `
// TaskMaster Planner - Sauvegarde des données
// Exporté le ${new Date().toLocaleString('fr-FR')}

const TASKMASTER_BACKUP = ${JSON.stringify(getAllAppData(), null, 2)};

// Cette variable contient toutes les données de l'application
// Pour restaurer les données, importez ce fichier dans l'application

// Function pour faciliter la restauration ultérieure
function getBackupData() {
  return TASKMASTER_BACKUP;
}
  `;

  const blob = new Blob([js], { type: 'text/javascript;charset=utf-8' });
  saveAs(blob, `taskmaster-backup-${new Date().toISOString().split('T')[0]}.js`);
};

/**
 * Gets all data from the application
 * This is a placeholder function that should be expanded to collect all relevant data
 */
function getAllAppData() {
  // Collect all data from localStorage
  const localStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        localStorageData[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch (e) {
        localStorageData[key] = localStorage.getItem(key);
      }
    }
  }

  // Here we would collect additional data from other sources like indexed DB if needed
  
  return {
    timestamp: new Date().toISOString(),
    version: '1.0',
    localStorage: localStorageData,
    // Add more data sources as needed
  };
}
