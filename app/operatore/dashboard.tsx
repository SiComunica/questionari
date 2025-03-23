import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo';

export default function DashboardOperatore() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Operatore</h1>
      
      <QuestionarioOperatoriNuovo fonte="operatore" />
      
      {/* ... altri componenti della dashboard ... */}
    </div>
  );
} 