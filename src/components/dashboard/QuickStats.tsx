const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="font-semibold text-neutral-800 mb-4">
          Tâches en cours
        </h3>
        <div className="text-3xl font-bold text-primary">12</div>
        <p className="text-neutral-600 text-sm mt-1">Cette semaine</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-neutral-800 mb-4">
          Heures travaillées
        </h3>
        <div className="text-3xl font-bold text-primary">156</div>
        <p className="text-neutral-600 text-sm mt-1">Ce mois</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-neutral-800 mb-4">
          Collaborateurs actifs
        </h3>
        <div className="text-3xl font-bold text-primary">8</div>
        <p className="text-neutral-600 text-sm mt-1">Sur 10</p>
      </div>
    </div>
  );
};

export default QuickStats;