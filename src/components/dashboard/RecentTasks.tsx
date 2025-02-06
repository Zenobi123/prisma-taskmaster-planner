const RecentTasks = () => {
  return (
    <div className="card mt-8">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Tâches récentes
      </h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Client</th>
              <th>Assigné à</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bilan annuel</td>
              <td>SARL Example</td>
              <td>Marie D.</td>
              <td>
                <span className="badge badge-green">En cours</span>
              </td>
            </tr>
            <tr>
              <td>Déclaration TVA</td>
              <td>SAS Tech</td>
              <td>Pierre M.</td>
              <td>
                <span className="badge badge-gray">En attente</span>
              </td>
            </tr>
            <tr>
              <td>Révision comptable</td>
              <td>EURL Web</td>
              <td>Sophie L.</td>
              <td>
                <span className="badge badge-green">En cours</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;