
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import PrimarySearchAppBar from './components/MenuBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Avaliacoes from './pages/Avaliacoes';
import Operacional from './pages/Operacional';
import Financeiro from './pages/Financeiro';
import Funcionarios from './pages/Funcionarios';
import Relatorios from './pages/Relatorios';
import Perfil from './pages/Perfil';
import Empresas from './pages/Empresas';
import Clientes from './pages/Cliente';
import Unidades from './pages/Unidade';


import EmpresaLayout from './layouts/EmpresaLayout';

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <PrimarySearchAppBar />}

      <Routes>
        {/* Acesso ao sistema */}
        <Route path="/login" element={<Login />} />

        {/* Central de empresas */}
        <Route path="/" element={<Home />} />

        {/* Gerenciamento e cadastro de empresas */}
        <Route path="/empresas" element={<Empresas />} />

        {/* Perfil do usuário */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Ambiente individual da empresa */}
        <Route
          path="/empresa/:empresaId"
          element={<EmpresaLayout />}
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route path="dashboard" element={<Painel />} />

          <Route path="operacional" element={<Operacional />} />

          <Route path="financeiro" element={<Financeiro />} />

          <Route path="funcionarios" element={<Funcionarios />} />

          <Route path="avaliacoes" element={<Avaliacoes />} />

          <Route path="relatorios" element={<Relatorios />} />

          <Route path="empresas" element={<Empresas />} />

          <Route path="cadastro/clientes" element={<Clientes />} />

          <Route path="cadastro/unidades" element={<Unidades />} />

        </Route>

        {/* Página não encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
