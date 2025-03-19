import QuestionariOperatoriList from '../../components/admin/QuestionariOperatoriList';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="space-y-8">
        {/* Tab o sezioni per i diversi tipi di questionari */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Questionari Operatori</h2>
          <QuestionariOperatoriList />
        </div>

        {/* Altre sezioni per gli altri tipi di questionari */}
      </div>
    </div>
  );
};

export default AdminDashboard; 