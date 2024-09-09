import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';

const LoginPage = () => {
  const handleRedirectToGoogleAuthApi = () => {
    window.location.href="http://localhost:3000/auth/google";
  };

  return (
    <div className="container">
      <h1>Login SSO</h1>
      <div className="card">
        <GoogleButton onClick={handleRedirectToGoogleAuthApi} />
      </div>
    </div>
  );
};

const SuccessPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: AxiosResponse<any> = await axios.get('http://localhost:3000/protected/route', {
          withCredentials: true,
        });

        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Erro de autenticação:', error.response?.data || error.message);
        } else {
          console.error('Erro inesperado:', error);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="container">
      <h1>Login com sucesso!</h1>
      {user ? (
        <div>
          <h2>Informações do Usuário:</h2>
          <p>Email: {user.email}</p>
          <p>Nome: {user.firstName} {user.lastName}</p>
          <img src={user.picture} alt="User Picture" />
        </div>
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
