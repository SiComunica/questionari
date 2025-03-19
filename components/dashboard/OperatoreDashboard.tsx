import Link from 'next/link';

const OperatoreDashboard = () => {
  return (
    <div>
      {/* ... nel componente esistente */}
      <Link href="/operatore/questionari/nuovo">
        <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Compila Questionario
        </a>
      </Link>
    </div>
  );
};

export default OperatoreDashboard; 