import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminProductos from '../components/AdminProductos';
import '../styles/components/adminPanel.scss';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    earnings: 628,
    shares: 2434,
    likes: 1259,
    rating: 8.5,
    completion: 45
  });
  useEffect(() => {
    if (!user || user.idRol !== 2) {
      navigate('/adminLogin');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/adminLogin');
  };

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            {user?.nombre?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="user-info">
            <div className="name">{user?.nombre || 'Admin'}</div>
            <div className="email">{user?.email || 'admin@nextlevel.com'}</div>
          </div>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveSection('productos')}
          >
            <i className="fas fa-box"></i>
            Productos
          </button>
          <button 
            className={`nav-item ${activeSection === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveSection('pedidos')}
          >
            <i className="fas fa-shopping-cart"></i>
            Pedidos
          </button>
          <button 
            className={`nav-item ${activeSection === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveSection('clientes')}
          >
            <i className="fas fa-users"></i>
            Clientes
          </button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </aside>

      <div className="main-content">
        {activeSection === 'dashboard' ? (
          <>
            <div className="dashboard-header">
              <div className="welcome-text">
                <h1>Bienvenido, {user?.nombre || 'Admin'}</h1>
                <p>Aquí tienes un resumen de tu negocio</p>
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="label">Ganancias</div>
                  <div className="icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                </div>
                <div className="value">${stats.earnings}</div>
                <div className="trend up">
                  <i className="fas fa-arrow-up"></i>
                  8.2% vs mes anterior
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="label">Compartidos</div>
                  <div className="icon">
                    <i className="fas fa-share-alt"></i>
                  </div>
                </div>
                <div className="value">{stats.shares}</div>
                <div className="trend up">
                  <i className="fas fa-arrow-up"></i>
                  12.4% vs mes anterior
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="label">Me gusta</div>
                  <div className="icon">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
                <div className="value">{stats.likes}</div>
                <div className="trend down">
                  <i className="fas fa-arrow-down"></i>
                  3.1% vs mes anterior
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="label">Calificación</div>
                  <div className="icon">
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <div className="value">{stats.rating}</div>
                <div className="trend up">
                  <i className="fas fa-arrow-up"></i>
                  0.8% vs mes anterior
                </div>
              </div>
            </div>

            <div className="chart-section">
              <div className="chart-container">
                <h3>Ventas Mensuales</h3>
                {/* Aquí iría el componente de gráfico */}
              </div>
            </div>
          </>
        ) : activeSection === 'productos' ? (
          <AdminProductos />
        ) : (
          <div className="coming-soon">
            <h2>Próximamente</h2>
            <p>Esta sección estará disponible pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
