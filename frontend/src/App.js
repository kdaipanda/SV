import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// Context for veterinarian authentication
const VetContext = createContext();

const useVet = () => {
  const context = useContext(VetContext);
  if (!context) {
    throw new Error('useVet must be used within a VetProvider');
  }
  return context;
};

const VetProvider = ({ children }) => {
  const [veterinarian, setVeterinarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored veterinarian data
    const storedVet = localStorage.getItem('veterinarian');
    if (storedVet) {
      setVeterinarian(JSON.parse(storedVet));
    }
    setLoading(false);
  }, []);

  const login = (vetData) => {
    setVeterinarian(vetData);
    localStorage.setItem('veterinarian', JSON.stringify(vetData));
  };

  const logout = () => {
    setVeterinarian(null);
    localStorage.removeItem('veterinarian');
  };

  return (
    <VetContext.Provider value={{ veterinarian, login, logout, loading }}>
      {children}
    </VetContext.Provider>
  );
};

// Main App Component
function App() {
  return (
    <VetProvider>
      <div className="App">
        <Router />
      </div>
    </VetProvider>
  );
}

// Router Component
const Router = () => {
  const [currentView, setCurrentView] = useState('landing');
  const { veterinarian, loading } = useVet();

  // URL parameter handling for payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const view = urlParams.get('view');
    
    if (sessionId) {
      setCurrentView('payment-success');
    } else if (view) {
      setCurrentView(view);
    } else if (veterinarian) {
      setCurrentView('dashboard');
    }
  }, [veterinarian]);

  if (loading) {
    return <LoadingScreen />;
  }

  const views = {
    'landing': <LandingPage setView={setCurrentView} />,
    'register': <RegisterPage setView={setCurrentView} />,
    'login': <LoginPage setView={setCurrentView} />,
    'dashboard': <Dashboard setView={setCurrentView} />,
    'new-consultation': <NewConsultation setView={setCurrentView} />,
    'consultation-history': <ConsultationHistory setView={setCurrentView} />,
    'membership': <MembershipPage setView={setCurrentView} />,
    'payment-success': <PaymentSuccess setView={setCurrentView} />,
    'profile': <Profile setView={setCurrentView} />
  };

  return views[currentView] || <LandingPage setView={setCurrentView} />;
};

// Loading Screen
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <p>Cargando Savant Vet...</p>
  </div>
);

// Navigation Header
const Header = ({ setView, showAuth = true }) => {
  const { veterinarian, logout } = useVet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update if at top for transparency effect
      setIsAtTop(currentScrollY < 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isAtTop ? '' : 'transparent'}`}>
      <div className="container">
        <div className="nav-brand" onClick={() => setView(veterinarian ? 'dashboard' : 'landing')}>
          <img src="/savant_logo.png" alt="Savant Vet" className="logo-image" />
          <h1>Savant Vet</h1>
        </div>
        
        {showAuth && (
          <>
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
            <nav className="nav-menu">
              {veterinarian ? (
                <>
                  <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className="nav-link">
                    Dashboard
                  </button>
                  <button onClick={() => { setView('new-consultation'); setIsMenuOpen(false); }} className="nav-link">
                    Nueva Consulta
                  </button>
                  <button onClick={() => { setView('consultation-history'); setIsMenuOpen(false); }} className="nav-link">
                    Historial
                  </button>
                  <button onClick={() => { setView('membership'); setIsMenuOpen(false); }} className="nav-link">
                    Membresía
                  </button>
                  <div className="vet-profile">
                    <div className="vet-info">
                      <span className="vet-name">{veterinarian.nombre}</span>
                      <span className="vet-membership">{veterinarian.membership_type || 'Sin membresía'}</span>
                    </div>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="logout-btn">
                      <span className="logout-icon">👋</span>
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setView('login'); setIsMenuOpen(false); }} className="nav-link">
                    Iniciar Sesión
                  </button>
                  <button onClick={() => { setView('register'); setIsMenuOpen(false); }} className="btn btn-primary">
                    Registrarse
                  </button>
                </>
              )}
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

// Landing Page
const LandingPage = ({ setView }) => {
  return (
    <div className="landing-page">
      <Header setView={setView} />
      
      <section className="hero">
        <div className="container">
          <div className="hero-main">
            <h1>Plataforma Médica Profesional para Veterinarios Certificados</h1>
            <p>Savant Vet es una plataforma especializada de consultoría veterinaria diseñada exclusivamente para médicos veterinarios profesionales. Obtén diagnósticos especializados, análisis clínicos avanzados y planes de tratamiento basados en evidencia científica para brindar el mejor cuidado a tus pacientes.</p>
            
            <div className="hero-actions">
              <button onClick={() => setView('register')} className="btn btn-primary btn-large">
                Registrarse como Veterinario
                <span className="btn-arrow">→</span>
              </button>
              <button onClick={() => {
                const section = document.getElementById('membresias');
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }} className="btn btn-link">
                Ver Membresías →
              </button>
            </div>
          </div>

          <div className="hero-images">
            <div className="hero-image-card purple">
              <img src="https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?w=400&h=400&fit=crop&crop=faces&auto=format&q=85" alt="Veterinario profesional con gato" />
            </div>
            <div className="hero-image-card blue">
              <img src="https://images.unsplash.com/photo-1654895716780-b4664497420d?w=600&h=400&fit=crop&crop=faces&auto=format&q=85" alt="Consulta veterinaria profesional" />
            </div>
            <div className="hero-image-card yellow">
              <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop&crop=faces&auto=format&q=85" alt="Veterinaria amigable con mascota" />
            </div>
          </div>
        </div>
      </section>

      <section className="services-badges">
        <div className="container">
          <div className="badges-grid">
            <div className="service-badge">
              <span className="badge-dot purple"></span>
              Solo veterinarios certificados
            </div>
            <div className="service-badge">
              <span className="badge-dot blue"></span>
              Análisis clínico especializado
            </div>
            <div className="service-badge">
              <span className="badge-dot green"></span>
              Diagnósticos diferenciales
            </div>
            <div className="service-badge">
              <span className="badge-dot orange"></span>
              Planes de tratamiento
            </div>
            <div className="service-badge">
              <span className="badge-dot teal"></span>
              Consultoría por especies
            </div>
            <div className="service-badge">
              <span className="badge-dot yellow"></span>
              Evidencia científica
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="services-badge">
            <span className="badge-dot orange"></span>
            Servicios que ofrecemos
          </div>
          
          <h2>Servicios veterinarios adaptados a las necesidades de tus pacientes</h2>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon yellow">
                <span>🔬</span>
              </div>
              <h3>Análisis Diagnóstico Especializado</h3>
              <p>Análisis veterinario profesional con inteligencia especializada para obtener diagnósticos diferenciales precisos y planes de tratamiento basados en evidencia científica.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon blue">
                <span>🐕</span>
              </div>
              <h3>Consultas Categorizadas por Especies</h3>
              <p>Sistemas especializados para pequeñas especies, animales de producción, equinos y exóticos. Cada categoría con protocolos específicos y actualizados.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon orange">
                <span>⚕️</span>
              </div>
              <h3>Plataforma Profesional Verificada</h3>
              <p>Acceso exclusivo para médicos veterinarios certificados con validación de cédulas profesionales mexicanas para garantizar la calidad del servicio.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="membresias" className="memberships">
        <div className="container">
          <div className="memberships-header">
            <div className="services-badge">
              <span className="badge-dot purple"></span>
              Membresías
            </div>
            <h2>Planes diseñados para profesionales veterinarios</h2>
            <p>Elige el plan que mejor se adapte a tu práctica profesional y volumen de consultas</p>
          </div>
          
          <div className="membership-cards">
            <div className="membership-card basic">
              <div className="membership-header">
                <h3>Básica</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">299</span>
                  <span className="period">MXN/mes</span>
                </div>
              </div>
              <div className="membership-features">
                <div className="feature">✅ 10 consultas mensuales</div>
                <div className="feature">✅ Análisis especializado por categoría</div>
                <div className="feature">✅ Diagnósticos diferenciales</div>
                <div className="feature">✅ Planes de tratamiento</div>
                <div className="feature">✅ Soporte por email</div>
              </div>
              <button onClick={() => setView('membership')} className="btn btn-outline">
                Seleccionar Plan
              </button>
            </div>

            <div className="membership-card professional featured">
              <div className="popular-badge">Más Popular</div>
              <div className="membership-header">
                <h3>Profesional</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">599</span>
                  <span className="period">MXN/mes</span>
                </div>
              </div>
              <div className="membership-features">
                <div className="feature">✅ 25 consultas mensuales</div>
                <div className="feature">✅ Todas las funciones de Básica</div>
                <div className="feature">✅ Soporte prioritario</div>
                <div className="feature">✅ Historial extendido</div>
                <div className="feature">✅ Referencias bibliográficas</div>
              </div>
              <button onClick={() => setView('membership')} className="btn btn-primary">
                Seleccionar Plan
              </button>
            </div>

            <div className="membership-card premium">
              <div className="membership-header">
                <h3>Premium</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">999</span>
                  <span className="period">MXN/mes</span>
                </div>
              </div>
              <div className="membership-features">
                <div className="feature">✅ Consultas ilimitadas</div>
                <div className="feature">✅ Todas las funciones de Profesional</div>
                <div className="feature">✅ Soporte 24/7</div>
                <div className="feature">✅ Contenido exclusivo</div>
                <div className="feature">✅ Análisis avanzados</div>
              </div>
              <button onClick={() => setView('membership')} className="btn btn-outline">
                Seleccionar Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para revolucionar tus consultas veterinarias?</h2>
            <p>Únete a cientos de veterinarios que ya confían en Savant Vet</p>
            <button onClick={() => setView('register')} className="btn btn-primary btn-large">
              Comenzar Ahora
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <h3>Savant Vet</h3>
                <p>Plataforma profesional de consultoría veterinaria especializada para médicos veterinarios certificados en México.</p>
                <div className="footer-contact">
                  <p><strong>Email:</strong> contacto@savantvet.com</p>
                  <p><strong>Teléfono:</strong> +52 55 1234 5678</p>
                  <p><strong>Horario:</strong> Lun - Vie 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h4>Servicios</h4>
              <ul>
                <li><a href="#" onClick={() => setView('register')}>Análisis Diagnóstico</a></li>
                <li><a href="#" onClick={() => setView('register')}>Consultas Especializadas</a></li>
                <li><a href="#" onClick={() => setView('register')}>Pequeñas Especies</a></li>
                <li><a href="#" onClick={() => setView('register')}>Animales de Producción</a></li>
                <li><a href="#" onClick={() => setView('register')}>Equinos</a></li>
                <li><a href="#" onClick={() => setView('register')}>Animales Exóticos</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#" onClick={() => setView('landing')}>Acerca de Nosotros</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Nuestro Equipo</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Misión y Visión</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Contacto</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Carreras</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Blog</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Membresías</h4>
              <ul>
                <li><a href="#" onClick={() => setView('membership')}>Plan Básico</a></li>
                <li><a href="#" onClick={() => setView('membership')}>Plan Profesional</a></li>
                <li><a href="#" onClick={() => setView('membership')}>Plan Premium</a></li>
                <li><a href="#" onClick={() => setView('membership')}>Comparar Planes</a></li>
                <li><a href="#" onClick={() => setView('membership')}>Preguntas Frecuentes</a></li>
                <li><a href="#" onClick={() => setView('membership')}>Soporte</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" onClick={() => setView('landing')}>Términos de Servicio</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Política de Privacidad</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Política de Cookies</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Cumplimiento LOPD</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Código de Ética</a></li>
                <li><a href="#" onClick={() => setView('landing')}>Licencias</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 Savant Vet. Todos los derechos reservados.</p>
              <div className="footer-social">
                <span>Síguenos:</span>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Register Page
const RegisterPage = ({ setView }) => {
  const { login } = useVet();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cedula_profesional: '',
    especialidad: '',
    años_experiencia: '',
    institucion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          años_experiencia: parseInt(formData.años_experiencia)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      const vetData = await response.json();
      login(vetData);
      setView('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header setView={setView} showAuth={false} />
      
      <div className="auth-container">
        <div className="auth-card">
          <h2>Registro Profesional</h2>
          <p>Complete sus datos profesionales para acceder a la plataforma</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Dr. Juan Pérez"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="juan.perez@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="+52 555 123 4567"
                />
              </div>
              <div className="form-group">
                <label>Cédula Profesional *</label>
                <input
                  type="text"
                  required
                  value={formData.cedula_profesional}
                  onChange={(e) => setFormData({...formData, cedula_profesional: e.target.value})}
                  placeholder="12345678"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Especialidad *</label>
              <select
                required
                value={formData.especialidad}
                onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
              >
                <option value="">Seleccione una especialidad</option>
                <option value="Pequeñas Especies">Pequeñas Especies</option>
                <option value="Animales de Producción">Animales de Producción</option>
                <option value="Equinos">Equinos</option>
                <option value="Animales Exóticos">Animales Exóticos</option>
                <option value="Medicina Preventiva">Medicina Preventiva</option>
                <option value="Patología">Patología</option>
                <option value="Cirugía">Cirugía</option>
                <option value="Medicina Interna">Medicina Interna</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Años de Experiencia *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={formData.años_experiencia}
                  onChange={(e) => setFormData({...formData, años_experiencia: e.target.value})}
                  placeholder="5"
                />
              </div>
              <div className="form-group">
                <label>Institución *</label>
                <input
                  type="text"
                  required
                  value={formData.institucion}
                  onChange={(e) => setFormData({...formData, institucion: e.target.value})}
                  placeholder="Hospital Veterinario ABC"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="auth-footer">
            ¿Ya tienes una cuenta?{' '}
            <button onClick={() => setView('login')} className="link-btn">
              Inicia Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = ({ setView }) => {
  const { login } = useVet();
  const [formData, setFormData] = useState({
    email: '',
    cedula_profesional: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el login');
      }

      const vetData = await response.json();
      login(vetData);
      setView('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header setView={setView} showAuth={false} />
      
      <div className="auth-container">
        <div className="auth-card">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa con tu email y cédula profesional</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="tu.email@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label>Cédula Profesional</label>
              <input
                type="text"
                required
                value={formData.cedula_profesional}
                onChange={(e) => setFormData({...formData, cedula_profesional: e.target.value})}
                placeholder="12345678"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-footer">
            ¿No tienes una cuenta?{' '}
            <button onClick={() => setView('register')} className="link-btn">
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = ({ setView }) => {
  const { veterinarian } = useVet();
  const [stats, setStats] = useState({ consultations: 0, thisMonth: 0 });
  const [recentConsultations, setRecentConsultations] = useState([]);

  useEffect(() => {
    if (veterinarian) {
      loadDashboardData();
    }
  }, [veterinarian]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/${veterinarian.id}/history`);
      if (response.ok) {
        const data = await response.json();
        const consultations = data.consultations || [];
        
        const thisMonth = consultations.filter(c => {
          const date = new Date(c.created_at);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          consultations: consultations.length,
          thisMonth
        });
        
        setRecentConsultations(consultations.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getMembershipStatus = () => {
    if (!veterinarian.membership_type) {
      return { status: 'Sin membresía', color: 'red', consultations: 'N/A' };
    }

    const remaining = veterinarian.consultations_remaining;
    if (veterinarian.membership_type === 'premium') {
      return { status: 'Premium', color: 'gold', consultations: 'Ilimitadas' };
    }

    return {
      status: veterinarian.membership_type === 'basic' ? 'Básica' : 'Profesional',
      color: remaining > 5 ? 'green' : remaining > 0 ? 'orange' : 'red',
      consultations: remaining
    };
  };

  const membershipStatus = getMembershipStatus();

  return (
    <div className="dashboard-page">
      <Header setView={setView} />
      
      <div className="container">
        <div className="dashboard-header">
          <h1>Bienvenido, {veterinarian.nombre}</h1>
          <p>Gestiona tus consultas veterinarias y membresía</p>
        </div>

        <div className="dashboard-grid">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.consultations}</h3>
                <p>Consultas Totales</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{stats.thisMonth}</h3>
                <p>Este Mes</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{color: membershipStatus.color}}>💎</div>
              <div className="stat-content">
                <h3>{membershipStatus.status}</h3>
                <p>{membershipStatus.consultations} consultas</p>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div className="action-cards">
              <button onClick={() => setView('new-consultation')} className="action-card">
                <div className="action-icon">➕</div>
                <h3>Nueva Consulta</h3>
                <p>Iniciar análisis especializado</p>
              </button>
              
              <button onClick={() => setView('consultation-history')} className="action-card">
                <div className="action-icon">📋</div>
                <h3>Ver Historial</h3>
                <p>Consultas previas y resultados</p>
              </button>
              
              <button onClick={() => setView('membership')} className="action-card">
                <div className="action-icon">⭐</div>
                <h3>Membresía</h3>
                <p>Actualizar plan o renovar</p>
              </button>
            </div>
          </div>

          <div className="recent-consultations">
            <h2>Consultas Recientes</h2>
            {recentConsultations.length > 0 ? (
              <div className="consultation-list">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-info">
                      <h4>{consultation.especie} - {consultation.raza}</h4>
                      <p>{consultation.motivo_consulta}</p>
                      <small>{new Date(consultation.created_at).toLocaleDateString()}</small>
                    </div>
                    <span className={`status ${consultation.status}`}>
                      {consultation.status === 'completed' ? 'Completada' : 
                       consultation.status === 'in_progress' ? 'En Progreso' : 'Borrador'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay consultas recientes</p>
                <button onClick={() => setView('new-consultation')} className="btn btn-primary">
                  Crear Primera Consulta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New Consultation Component
const NewConsultation = ({ setView }) => {
  const { veterinarian } = useVet();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [consultationId, setConsultationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Complete pet information
    fecha: new Date().toISOString().split('T')[0],
    nombre_mascota: '',
    nombre_dueño: '',
    raza: '',
    mix: '',
    edad: '',
    peso: '',
    condicion_corporal: '3',
    sexo: '',
    estado_reproductivo: '',
    vacunas_vigentes: '',
    vacunas_cual: '',
    desparasitacion_interna: '',
    desparasitacion_interna_cual: '',
    desparasitacion_externa: '',
    desparasitacion_externa_producto: '',
    desparasitacion_externa_fecha: '',
    habitat: '',
    zona_geografica: '',
    alimentacion_seco: '',
    alimentacion_humedo: '',
    alimentacion_casero: '',
    alimentacion_frecuencia: '',
    paseos: '',
    paseos_frecuencia: '',
    baños_estetica: '',
    baños_fecha: '',
    cirugias_previas: '',
    cirugias_cual: '',
    aspecto_pelaje: '',
    aspecto_piel: '',
    aspecto_oidos: '',
    aspecto_ojos: '',
    aspecto_otros: '',
    
    // Historial reportado
    vomito: 'NO',
    vomito_color: '',
    vomito_aspecto: '',
    diarrea: 'NO',
    diarrea_color: '',
    diarrea_aspecto: '',
    orina: 'NO',
    orina_color: '',
    orina_olor: '',
    secrecion_nasal: 'NO',
    secrecion_nasal_color: '',
    secrecion_nasal_aspecto: '',
    secrecion_ocular: 'NO',
    secrecion_ocular_color: '',
    dientes: 'limpios',
    dientes_otros: '',
    piel_condicion: 'normal',
    ultima_comida: '',
    ultima_comida_fecha: '',
    liquidos: '',
    liquidos_cantidad: '',
    actividad_general: 'ACTIVO',
    medicamentos: 'NO',
    medicamentos_cual: '',
    
    // Stage 2: Detailed patient information
    detalle_paciente: ''
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/animal-categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          veterinarian_id: veterinarian.id,
          category: selectedCategory,
          consultation_data: {
            fecha: formData.fecha,
            nombre_mascota: formData.nombre_mascota,
            nombre_dueño: formData.nombre_dueño,
            raza: formData.raza,
            mix: formData.mix,
            edad: formData.edad,
            peso: formData.peso,
            condicion_corporal: formData.condicion_corporal,
            sexo: formData.sexo,
            estado_reproductivo: formData.estado_reproductivo,
            vacunas_vigentes: formData.vacunas_vigentes,
            vacunas_cual: formData.vacunas_cual,
            desparasitacion_interna: formData.desparasitacion_interna,
            desparasitacion_interna_cual: formData.desparasitacion_interna_cual,
            desparasitacion_externa: formData.desparasitacion_externa,
            desparasitacion_externa_producto: formData.desparasitacion_externa_producto,
            desparasitacion_externa_fecha: formData.desparasitacion_externa_fecha,
            habitat: formData.habitat,
            zona_geografica: formData.zona_geografica,
            alimentacion_seco: formData.alimentacion_seco,
            alimentacion_humedo: formData.alimentacion_humedo,
            alimentacion_casero: formData.alimentacion_casero,
            alimentacion_frecuencia: formData.alimentacion_frecuencia,
            paseos: formData.paseos,
            paseos_frecuencia: formData.paseos_frecuencia,
            baños_estetica: formData.baños_estetica,
            baños_fecha: formData.baños_fecha,
            cirugias_previas: formData.cirugias_previas,
            cirugias_cual: formData.cirugias_cual,
            aspecto_pelaje: formData.aspecto_pelaje,
            aspecto_piel: formData.aspecto_piel,
            aspecto_oidos: formData.aspecto_oidos,
            aspecto_ojos: formData.aspecto_ojos,
            aspecto_otros: formData.aspecto_otros,
            
            // Historial reportado
            vomito: formData.vomito,
            vomito_color: formData.vomito_color,
            vomito_aspecto: formData.vomito_aspecto,
            diarrea: formData.diarrea,
            diarrea_color: formData.diarrea_color,
            diarrea_aspecto: formData.diarrea_aspecto,
            orina: formData.orina,
            orina_color: formData.orina_color,
            orina_olor: formData.orina_olor,
            secrecion_nasal: formData.secrecion_nasal,
            secrecion_nasal_color: formData.secrecion_nasal_color,
            secrecion_nasal_aspecto: formData.secrecion_nasal_aspecto,
            secrecion_ocular: formData.secrecion_ocular,
            secrecion_ocular_color: formData.secrecion_ocular_color,
            dientes: formData.dientes,
            dientes_otros: formData.dientes_otros,
            piel_condicion: formData.piel_condicion,
            ultima_comida: formData.ultima_comida,
            ultima_comida_fecha: formData.ultima_comida_fecha,
            liquidos: formData.liquidos,
            liquidos_cantidad: formData.liquidos_cantidad,
            actividad_general: formData.actividad_general,
            medicamentos: formData.medicamentos,
            medicamentos_cual: formData.medicamentos_cual
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error creando consulta');
      }

      const consultation = await response.json();
      setConsultationId(consultation.id);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/${consultationId}/observations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          detalle_paciente: formData.detalle_paciente
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error actualizando observaciones');
      }

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/${consultationId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en análisis');
      }

      const result = await response.json();
      setAiAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="consultation-page">
        <Header setView={setView} />
        
        <div className="container">
          <div className="consultation-header">
            <button onClick={() => setView('dashboard')} className="back-btn">← Volver</button>
            <h1>Nueva Consulta - Paso 1/3</h1>
            <p>Datos Generales de la Mascota</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="consultation-form-container">
            <div className="step-indicator">
              <div className="step active">1. Datos de la Mascota</div>
              <div className="step">2. Motivo de Consulta</div>
              <div className="step">3. Análisis Diagnóstico</div>
            </div>

            <form onSubmit={handleSubmitStep1} className="consultation-form">
              <div className="form-section">
                <h3>Categoría Animal</h3>
                <div className="category-grid">
                  {Object.entries(categories).map(([key, category]) => (
                    <div
                      key={key}
                      className={`category-card ${selectedCategory === key ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      <h4>{category.name}</h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Información General</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input
                      type="date"
                      required
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre de la Mascota *</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre_mascota}
                      onChange={(e) => setFormData({...formData, nombre_mascota: e.target.value})}
                      placeholder="Nombre de la mascota"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Dueño *</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre_dueño}
                      onChange={(e) => setFormData({...formData, nombre_dueño: e.target.value})}
                      placeholder="Nombre completo del propietario"
                    />
                  </div>
                  <div className="form-group">
                    <label>Zona Geográfica de Residencia *</label>
                    <input
                      type="text"
                      required
                      value={formData.zona_geografica}
                      onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})}
                      placeholder="Ciudad, estado"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Datos Físicos de la Mascota</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Raza *</label>
                    <input
                      type="text"
                      required
                      value={formData.raza}
                      onChange={(e) => setFormData({...formData, raza: e.target.value})}
                      placeholder="Labrador, Persa, Holstein..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Mix</label>
                    <input
                      type="text"
                      value={formData.mix}
                      onChange={(e) => setFormData({...formData, mix: e.target.value})}
                      placeholder="Si es mestizo, especificar"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Edad *</label>
                    <input
                      type="text"
                      required
                      value={formData.edad}
                      onChange={(e) => setFormData({...formData, edad: e.target.value})}
                      placeholder="2 años, 6 meses..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Peso *</label>
                    <input
                      type="text"
                      required
                      value={formData.peso}
                      onChange={(e) => setFormData({...formData, peso: e.target.value})}
                      placeholder="25 kg, 3.5 kg..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Condición Corporal *</label>
                    <div className="radio-group">
                      {[1, 2, 3, 4, 5].map(num => (
                        <label key={num} className="radio-label">
                          <input
                            type="radio"
                            name="condicion_corporal"
                            value={num}
                            checked={formData.condicion_corporal === num.toString()}
                            onChange={(e) => setFormData({...formData, condicion_corporal: e.target.value})}
                          />
                          {num}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sexo *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="sexo"
                          value="hembra"
                          checked={formData.sexo === 'hembra'}
                          onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                        />
                        Hembra
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="sexo"
                          value="macho"
                          checked={formData.sexo === 'macho'}
                          onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                        />
                        Macho
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Estado Reproductivo *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="estado_reproductivo"
                          value="entero"
                          checked={formData.estado_reproductivo === 'entero'}
                          onChange={(e) => setFormData({...formData, estado_reproductivo: e.target.value})}
                        />
                        Entero
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="estado_reproductivo"
                          value="castrado"
                          checked={formData.estado_reproductivo === 'castrado'}
                          onChange={(e) => setFormData({...formData, estado_reproductivo: e.target.value})}
                        />
                        Castrado
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Historial Médico</h3>
                <div className="form-group">
                  <label>Vacunas Vigentes *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="vacunas_vigentes"
                        value="SI"
                        checked={formData.vacunas_vigentes === 'SI'}
                        onChange={(e) => setFormData({...formData, vacunas_vigentes: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="vacunas_vigentes"
                        value="NO"
                        checked={formData.vacunas_vigentes === 'NO'}
                        onChange={(e) => setFormData({...formData, vacunas_vigentes: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.vacunas_vigentes === 'SI' && (
                    <input
                      type="text"
                      value={formData.vacunas_cual}
                      onChange={(e) => setFormData({...formData, vacunas_cual: e.target.value})}
                      placeholder="¿Cuáles?"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Desparasitación Interna</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="desparasitacion_interna"
                        value="SI"
                        checked={formData.desparasitacion_interna === 'SI'}
                        onChange={(e) => setFormData({...formData, desparasitacion_interna: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="desparasitacion_interna"
                        value="NO"
                        checked={formData.desparasitacion_interna === 'NO'}
                        onChange={(e) => setFormData({...formData, desparasitacion_interna: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.desparasitacion_interna === 'SI' && (
                    <input
                      type="text"
                      value={formData.desparasitacion_interna_cual}
                      onChange={(e) => setFormData({...formData, desparasitacion_interna_cual: e.target.value})}
                      placeholder="¿Cuál?"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Desparasitación Externa</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="desparasitacion_externa"
                        value="SI"
                        checked={formData.desparasitacion_externa === 'SI'}
                        onChange={(e) => setFormData({...formData, desparasitacion_externa: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="desparasitacion_externa"
                        value="NO"
                        checked={formData.desparasitacion_externa === 'NO'}
                        onChange={(e) => setFormData({...formData, desparasitacion_externa: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.desparasitacion_externa === 'SI' && (
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          value={formData.desparasitacion_externa_producto}
                          onChange={(e) => setFormData({...formData, desparasitacion_externa_producto: e.target.value})}
                          placeholder="Producto"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="date"
                          value={formData.desparasitacion_externa_fecha}
                          onChange={(e) => setFormData({...formData, desparasitacion_externa_fecha: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Cirugías Previas</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="cirugias_previas"
                        value="SI"
                        checked={formData.cirugias_previas === 'SI'}
                        onChange={(e) => setFormData({...formData, cirugias_previas: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="cirugias_previas"
                        value="NO"
                        checked={formData.cirugias_previas === 'NO'}
                        onChange={(e) => setFormData({...formData, cirugias_previas: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.cirugias_previas === 'SI' && (
                    <input
                      type="text"
                      value={formData.cirugias_cual}
                      onChange={(e) => setFormData({...formData, cirugias_cual: e.target.value})}
                      placeholder="¿Cuál?"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Hábitat y Alimentación</h3>
                <div className="form-group">
                  <label>Hábitat de la Mascota *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="habitat"
                        value="INTERIOR"
                        checked={formData.habitat === 'INTERIOR'}
                        onChange={(e) => setFormData({...formData, habitat: e.target.value})}
                      />
                      Interior
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="habitat"
                        value="EXTERIOR"
                        checked={formData.habitat === 'EXTERIOR'}
                        onChange={(e) => setFormData({...formData, habitat: e.target.value})}
                      />
                      Exterior
                    </label>
                  </div>
                </div>

                <div className="form-section-subtitle">
                  <h4>Alimentación</h4>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Alimento Seco - Marca</label>
                    <input
                      type="text"
                      value={formData.alimentacion_seco}
                      onChange={(e) => setFormData({...formData, alimentacion_seco: e.target.value})}
                      placeholder="Marca del alimento seco"
                    />
                  </div>
                  <div className="form-group">
                    <label>Alimento Húmedo - Marca</label>
                    <input
                      type="text"
                      value={formData.alimentacion_humedo}
                      onChange={(e) => setFormData({...formData, alimentacion_humedo: e.target.value})}
                      placeholder="Marca del alimento húmedo"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Alimentación Casera</label>
                    <input
                      type="text"
                      value={formData.alimentacion_casero}
                      onChange={(e) => setFormData({...formData, alimentacion_casero: e.target.value})}
                      placeholder="Descripción de la alimentación casera"
                    />
                  </div>
                  <div className="form-group">
                    <label>Frecuencia de Alimentación</label>
                    <input
                      type="text"
                      value={formData.alimentacion_frecuencia}
                      onChange={(e) => setFormData({...formData, alimentacion_frecuencia: e.target.value})}
                      placeholder="Ej: 2 veces al día"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Paseos</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paseos"
                        value="SI"
                        checked={formData.paseos === 'SI'}
                        onChange={(e) => setFormData({...formData, paseos: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paseos"
                        value="NO"
                        checked={formData.paseos === 'NO'}
                        onChange={(e) => setFormData({...formData, paseos: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.paseos === 'SI' && (
                    <input
                      type="text"
                      value={formData.paseos_frecuencia}
                      onChange={(e) => setFormData({...formData, paseos_frecuencia: e.target.value})}
                      placeholder="Frecuencia de paseos"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Baños o Servicio de Estética Reciente</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="baños_estetica"
                        value="SI"
                        checked={formData.baños_estetica === 'SI'}
                        onChange={(e) => setFormData({...formData, baños_estetica: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="baños_estetica"
                        value="NO"
                        checked={formData.baños_estetica === 'NO'}
                        onChange={(e) => setFormData({...formData, baños_estetica: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.baños_estetica === 'SI' && (
                    <input
                      type="date"
                      value={formData.baños_fecha}
                      onChange={(e) => setFormData({...formData, baños_fecha: e.target.value})}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Aspecto General de la Mascota</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pelaje</label>
                    <input
                      type="text"
                      value={formData.aspecto_pelaje}
                      onChange={(e) => setFormData({...formData, aspecto_pelaje: e.target.value})}
                      placeholder="Descripción del pelaje"
                    />
                  </div>
                  <div className="form-group">
                    <label>Piel</label>
                    <input
                      type="text"
                      value={formData.aspecto_piel}
                      onChange={(e) => setFormData({...formData, aspecto_piel: e.target.value})}
                      placeholder="Descripción de la piel"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Oídos</label>
                    <input
                      type="text"
                      value={formData.aspecto_oidos}
                      onChange={(e) => setFormData({...formData, aspecto_oidos: e.target.value})}
                      placeholder="Descripción de los oídos"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ojos</label>
                    <input
                      type="text"
                      value={formData.aspecto_ojos}
                      onChange={(e) => setFormData({...formData, aspecto_ojos: e.target.value})}
                      placeholder="Descripción de los ojos"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Otros</label>
                  <input
                    type="text"
                    value={formData.aspecto_otros}
                    onChange={(e) => setFormData({...formData, aspecto_otros: e.target.value})}
                    placeholder="Otras observaciones del aspecto general"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Historial Reportado</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Vómito</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="vomito"
                          value="SI"
                          checked={formData.vomito === 'SI'}
                          onChange={(e) => setFormData({...formData, vomito: e.target.value})}
                        />
                        Sí
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="vomito"
                          value="NO"
                          checked={formData.vomito === 'NO'}
                          onChange={(e) => setFormData({...formData, vomito: e.target.value})}
                        />
                        No
                      </label>
                    </div>
                    {formData.vomito === 'SI' && (
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="text"
                            value={formData.vomito_color}
                            onChange={(e) => setFormData({...formData, vomito_color: e.target.value})}
                            placeholder="Color"
                            className="mt-2"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={formData.vomito_aspecto}
                            onChange={(e) => setFormData({...formData, vomito_aspecto: e.target.value})}
                            placeholder="Aspecto"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Diarrea</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="diarrea"
                          value="SI"
                          checked={formData.diarrea === 'SI'}
                          onChange={(e) => setFormData({...formData, diarrea: e.target.value})}
                        />
                        Sí
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="diarrea"
                          value="NO"
                          checked={formData.diarrea === 'NO'}
                          onChange={(e) => setFormData({...formData, diarrea: e.target.value})}
                        />
                        No
                      </label>
                    </div>
                    {formData.diarrea === 'SI' && (
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="text"
                            value={formData.diarrea_color}
                            onChange={(e) => setFormData({...formData, diarrea_color: e.target.value})}
                            placeholder="Color"
                            className="mt-2"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={formData.diarrea_aspecto}
                            onChange={(e) => setFormData({...formData, diarrea_aspecto: e.target.value})}
                            placeholder="Aspecto"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Dientes</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dientes"
                        value="limpios"
                        checked={formData.dientes === 'limpios'}
                        onChange={(e) => setFormData({...formData, dientes: e.target.value})}
                      />
                      Limpios
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dientes"
                        value="placas"
                        checked={formData.dientes === 'placas'}
                        onChange={(e) => setFormData({...formData, dientes: e.target.value})}
                      />
                      Placas
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dientes"
                        value="gingivitis"
                        checked={formData.dientes === 'gingivitis'}
                        onChange={(e) => setFormData({...formData, dientes: e.target.value})}
                      />
                      Gingivitis
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dientes"
                        value="periodontitis"
                        checked={formData.dientes === 'periodontitis'}
                        onChange={(e) => setFormData({...formData, dientes: e.target.value})}
                      />
                      Periodontitis
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.dientes_otros}
                    onChange={(e) => setFormData({...formData, dientes_otros: e.target.value})}
                    placeholder="Otros (especificar)"
                    className="mt-2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Última Comida</label>
                    <input
                      type="text"
                      value={formData.ultima_comida}
                      onChange={(e) => setFormData({...formData, ultima_comida: e.target.value})}
                      placeholder="Descripción de la última comida"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Última Comida</label>
                    <input
                      type="datetime-local"
                      value={formData.ultima_comida_fecha}
                      onChange={(e) => setFormData({...formData, ultima_comida_fecha: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Líquidos</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="liquidos"
                        value="SI"
                        checked={formData.liquidos === 'SI'}
                        onChange={(e) => setFormData({...formData, liquidos: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="liquidos"
                        value="NO"
                        checked={formData.liquidos === 'NO'}
                        onChange={(e) => setFormData({...formData, liquidos: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.liquidos === 'SI' && (
                    <input
                      type="text"
                      value={formData.liquidos_cantidad}
                      onChange={(e) => setFormData({...formData, liquidos_cantidad: e.target.value})}
                      placeholder="Cantidad"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Actividad General</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="actividad_general"
                        value="ACTIVO"
                        checked={formData.actividad_general === 'ACTIVO'}
                        onChange={(e) => setFormData({...formData, actividad_general: e.target.value})}
                      />
                      Activo
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="actividad_general"
                        value="PASIVO"
                        checked={formData.actividad_general === 'PASIVO'}
                        onChange={(e) => setFormData({...formData, actividad_general: e.target.value})}
                      />
                      Pasivo
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="actividad_general"
                        value="DECAIDO"
                        checked={formData.actividad_general === 'DECAIDO'}
                        onChange={(e) => setFormData({...formData, actividad_general: e.target.value})}
                      />
                      Decaído
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="actividad_general"
                        value="ALETARGADO"
                        checked={formData.actividad_general === 'ALETARGADO'}
                        onChange={(e) => setFormData({...formData, actividad_general: e.target.value})}
                      />
                      Aletargado
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Medicamentos Administrados</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="medicamentos"
                        value="SI"
                        checked={formData.medicamentos === 'SI'}
                        onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                      />
                      Sí
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="medicamentos"
                        value="NO"
                        checked={formData.medicamentos === 'NO'}
                        onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                      />
                      No
                    </label>
                  </div>
                  {formData.medicamentos === 'SI' && (
                    <input
                      type="text"
                      value={formData.medicamentos_cual}
                      onChange={(e) => setFormData({...formData, medicamentos_cual: e.target.value})}
                      placeholder="¿Cuál?"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading || !selectedCategory}
                  className="btn btn-primary btn-large"
                >
                  {loading ? 'Guardando...' : 'Continuar al Paso 2'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="consultation-page">
        <Header setView={setView} />
        
        <div className="container">
          <div className="consultation-header">
            <button onClick={() => setStep(1)} className="back-btn">← Volver</button>
            <h1>Nueva Consulta - Paso 2/3</h1>
            <p>Motivo de Consulta y Observaciones</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="consultation-form-container">
            <div className="step-indicator">
              <div className="step completed">1. Datos de la Mascota</div>
              <div className="step active">2. Motivo de Consulta</div>
              <div className="step">3. Análisis Diagnóstico</div>
            </div>

            <form onSubmit={handleSubmitStep2} className="consultation-form">
              <div className="form-section">
                <h3>Detalle del Paciente</h3>
                <div className="form-group">
                  <label>ANOTA CON EL MAYOR DETALLE LOS DATOS SOBRE EL PACIENTE. *SEA MUY ESPECÍFICO</label>
                  <textarea
                    required
                    rows={20}
                    value={formData.detalle_paciente}
                    onChange={(e) => setFormData({...formData, detalle_paciente: e.target.value})}
                    placeholder="Escriba aquí todos los detalles sobre el paciente, motivo de consulta, síntomas, observaciones clínicas, signos vitales, tratamientos previos, historia clínica, estudios realizados, comportamiento, y cualquier otra información relevante para el diagnóstico..."
                    style={{
                      minHeight: '400px',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      padding: '20px'
                    }}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary btn-large">
                  {loading ? 'Guardando...' : 'Continuar al Análisis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="consultation-page">
        <Header setView={setView} />
        
        <div className="container">
          <div className="consultation-header">
            <button onClick={() => setStep(2)} className="back-btn">← Volver</button>
            <h1>Nueva Consulta - Paso 3/3</h1>
            <p>Análisis Diagnóstico Especializado</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="consultation-form-container">
            <div className="step-indicator">
              <div className="step completed">1. Datos de la Mascota</div>
              <div className="step completed">2. Motivo de Consulta</div>
              <div className="step active">3. Análisis Diagnóstico</div>
            </div>

            <div className="ai-analysis-section">
              {!aiAnalysis ? (
                <div className="analysis-prompt">
                  <div className="analysis-icon">🤖</div>
                  <h3>¿Listo para el análisis especializado?</h3>
                  <p>
                    Nuestro sistema especializado en {categories[selectedCategory]?.name} 
                    analizará toda la información proporcionada para generar:
                  </p>
                  <ul>
                    <li>Diagnósticos diferenciales</li>
                    <li>Plan de tratamiento detallado</li>
                    <li>Estudios complementarios recomendados</li>
                    <li>Pronóstico</li>
                    <li>Referencias bibliográficas</li>
                  </ul>
                  
                  <button
                    onClick={handleAIAnalysis}
                    disabled={loading}
                    className="btn btn-primary btn-large"
                  >
                    {loading ? 'Analizando...' : 'Iniciar Análisis'}
                  </button>
                </div>
              ) : (
                <div className="analysis-result">
                  <h3>Análisis Veterinario Especializado</h3>
                  <div className="analysis-content">
                    <pre className="analysis-text">{aiAnalysis}</pre>
                  </div>
                  
                  <div className="analysis-actions">
                    <button
                      onClick={() => setView('consultation-history')}
                      className="btn btn-primary"
                    >
                      Ver en Historial
                    </button>
                    <button
                      onClick={() => {
                        setStep(1);
                        setConsultationId(null);
                        setAiAnalysis(null);
                        setFormData({
                          fecha: new Date().toISOString().split('T')[0],
                          nombre_mascota: '', nombre_dueño: '', raza: '', mix: '',
                          edad: '', peso: '', condicion_corporal: '3', sexo: '', estado_reproductivo: '',
                          vacunas_vigentes: '', vacunas_cual: '', desparasitacion_interna: '',
                          desparasitacion_interna_cual: '', desparasitacion_externa: '',
                          desparasitacion_externa_producto: '', desparasitacion_externa_fecha: '',
                          habitat: '', zona_geografica: '', alimentacion_seco: '', alimentacion_humedo: '',
                          alimentacion_casero: '', alimentacion_frecuencia: '', paseos: '',
                          paseos_frecuencia: '', baños_estetica: '', baños_fecha: '',
                          cirugias_previas: '', cirugias_cual: '', aspecto_pelaje: '',
                          aspecto_piel: '', aspecto_oidos: '', aspecto_ojos: '', aspecto_otros: '',
                          vomito: 'NO', vomito_color: '', vomito_aspecto: '', diarrea: 'NO',
                          diarrea_color: '', diarrea_aspecto: '', orina: 'NO', orina_color: '',
                          orina_olor: '', secrecion_nasal: 'NO', secrecion_nasal_color: '',
                          secrecion_nasal_aspecto: '', secrecion_ocular: 'NO', secrecion_ocular_color: '',
                          dientes: 'limpios', dientes_otros: '', piel_condicion: 'normal',
                          ultima_comida: '', ultima_comida_fecha: '', liquidos: '',
                          liquidos_cantidad: '', actividad_general: 'ACTIVO', medicamentos: 'NO',
                          medicamentos_cual: '', detalle_paciente: ''
                        });
                        setSelectedCategory('');
                      }}
                      className="btn btn-secondary"
                    >
                      Nueva Consulta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// Consultation History
const ConsultationHistory = ({ setView }) => {
  const { veterinarian } = useVet();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/${veterinarian.id}/history`);
      if (response.ok) {
        const data = await response.json();
        setConsultations(data.consultations || []);
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewConsultation = async (consultationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/${consultationId}`);
      if (response.ok) {
        const consultation = await response.json();
        setSelectedConsultation(consultation);
      }
    } catch (error) {
      console.error('Error loading consultation details:', error);
    }
  };

  if (selectedConsultation) {
    return (
      <div className="consultation-detail-page">
        <Header setView={setView} />
        
        <div className="container">
          <div className="consultation-header">
            <button onClick={() => setSelectedConsultation(null)} className="back-btn">
              ← Volver al Historial
            </button>
            <h1>Detalle de Consulta</h1>
            <p>Consulta del {new Date(selectedConsultation.created_at).toLocaleDateString()}</p>
          </div>

          <div className="consultation-detail">
            <div className="detail-section">
              <h3>Información del Paciente</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Especie:</strong> {selectedConsultation.especie}
                </div>
                <div className="detail-item">
                  <strong>Raza:</strong> {selectedConsultation.raza}
                </div>
                <div className="detail-item">
                  <strong>Edad:</strong> {selectedConsultation.edad}
                </div>
                <div className="detail-item">
                  <strong>Peso:</strong> {selectedConsultation.peso}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Motivo de Consulta</h3>
              <p>{selectedConsultation.motivo_consulta}</p>
            </div>

            <div className="detail-section">
              <h3>Síntomas</h3>
              <p>{selectedConsultation.sintomas}</p>
            </div>

            {selectedConsultation.ai_analysis && (
              <div className="detail-section">
                <h3>Análisis Especializado</h3>
                <div className="analysis-content">
                  <pre className="analysis-text">{selectedConsultation.ai_analysis}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <Header setView={setView} />
      
      <div className="container">
        <div className="page-header">
          <h1>Historial de Consultas</h1>
          <p>Todas tus consultas veterinarias realizadas</p>
          <button onClick={() => setView('new-consultation')} className="btn btn-primary">
            Nueva Consulta
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Cargando historial...</div>
        ) : consultations.length > 0 ? (
          <div className="consultations-grid">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <h3>{consultation.especie} - {consultation.raza}</h3>
                  <span className={`status ${consultation.status}`}>
                    {consultation.status === 'completed' ? 'Completada' : 
                     consultation.status === 'in_progress' ? 'En Progreso' : 'Borrador'}
                  </span>
                </div>
                
                <div className="consultation-content">
                  <p><strong>Motivo:</strong> {consultation.motivo_consulta}</p>
                  <p><strong>Fecha:</strong> {new Date(consultation.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="consultation-actions">
                  <button
                    onClick={() => handleViewConsultation(consultation.id)}
                    className="btn btn-secondary"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay consultas aún</h3>
            <p>Comienza creando tu primera consulta veterinaria</p>
            <button onClick={() => setView('new-consultation')} className="btn btn-primary">
              Crear Primera Consulta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Membership Page
const MembershipPage = ({ setView }) => {
  const { veterinarian } = useVet();
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/membership/packages`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const handlePurchase = async (packageId) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          origin_url: window.location.origin
        })
      });

      if (!response.ok) {
        throw new Error('Error creando sesión de pago');
      }

      const data = await response.json();
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Error:', error);
      alert('Error procesando el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getMembershipStatus = () => {
    if (!veterinarian.membership_type) {
      return { text: 'Sin membresía activa', color: 'red' };
    }
    
    const expiry = veterinarian.membership_expires ? 
      new Date(veterinarian.membership_expires) : null;
    
    if (expiry && expiry < new Date()) {
      return { text: 'Membresía expirada', color: 'red' };
    }

    const remaining = veterinarian.consultations_remaining || 0;
    const packageName = packages[veterinarian.membership_type]?.name || veterinarian.membership_type;
    
    return {
      text: `${packageName} - ${remaining === 999999 ? 'Ilimitadas' : remaining} consultas`,
      color: remaining > 5 || remaining === 999999 ? 'green' : remaining > 0 ? 'orange' : 'red'
    };
  };

  const status = getMembershipStatus();

  return (
    <div className="membership-page">
      <Header setView={setView} />
      
      <div className="container">
        <div className="page-header">
          <h1>Membresías Savant Vet</h1>
          <p>Elige el plan que mejor se adapte a tus necesidades</p>
          <div className="current-status" style={{color: status.color}}>
            Estado actual: {status.text}
          </div>
        </div>

        <div className="pricing-grid">
          {Object.entries(packages).map(([key, pkg]) => (
            <div key={key} className={`pricing-card ${veterinarian.membership_type === key ? 'current' : ''}`}>
              <div className="pricing-header">
                <h3>{pkg.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{pkg.price}</span>
                  <span className="period">MXN/mes</span>
                </div>
              </div>
              
              <div className="pricing-features">
                <div className="feature">
                  ✅ {pkg.consultations === 'unlimited' ? 'Consultas ilimitadas' : `${pkg.consultations} consultas/mes`}
                </div>
                <div className="feature">
                  ✅ Sistema especializado por categoría
                </div>
                <div className="feature">
                  ✅ Diagnósticos diferenciales
                </div>
                <div className="feature">
                  ✅ Planes de tratamiento
                </div>
                <div className="feature">
                  ✅ Referencias bibliográficas
                </div>
                {key === 'professional' && (
                  <>
                    <div className="feature">
                      ✅ Soporte prioritario
                    </div>
                    <div className="feature">
                      ✅ Historial extendido
                    </div>
                  </>
                )}
                {key === 'premium' && (
                  <>
                    <div className="feature">
                      ✅ Soporte 24/7
                    </div>
                    <div className="feature">
                      ✅ Consultas ilimitadas
                    </div>
                    <div className="feature">
                      ✅ Contenido exclusivo
                    </div>
                    <div className="feature">
                      ✅ Análisis avanzados
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={() => handlePurchase(key)}
                disabled={loading || veterinarian.membership_type === key}
                className={`btn ${key === 'premium' ? 'btn-primary' : 'btn-secondary'} btn-full`}
              >
                {veterinarian.membership_type === key ? 'Plan Actual' : 
                 loading ? 'Procesando...' : 'Seleccionar Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="membership-info">
          <h2>¿Por qué elegir una membresía?</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🔬</div>
              <h3>Sistema Especializado</h3>
              <p>Análisis especializados entrenados específicamente para cada categoría animal</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Resultados Rápidos</h3>
              <p>Análisis completo en minutos, no en horas</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📚</div>
              <h3>Basado en Evidencia</h3>
              <p>Recomendaciones respaldadas por literatura científica actualizada</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔄</div>
              <h3>Actualización Continua</h3>
              <p>Sistema en constante mejora con nuevos avances veterinarios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Success Page
const PaymentSuccess = ({ setView }) => {
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('session_id');
    
    if (id) {
      setSessionId(id);
      pollPaymentStatus(id);
    } else {
      setPaymentStatus('error');
    }
  }, []);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Error verificando pago');
      }

      const data = await response.json();
      
      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
    } catch (error) {
      console.error('Error checking payment:', error);
      setPaymentStatus('error');
    }
  };

  return (
    <div className="payment-success-page">
      <Header setView={setView} />
      
      <div className="container">
        <div className="payment-status-container">
          {paymentStatus === 'checking' && (
            <div className="status-card">
              <div className="status-icon loading">⏳</div>
              <h2>Verificando Pago</h2>
              <p>Estamos procesando tu pago, esto puede tomar unos momentos...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="status-card success">
              <div className="status-icon">✅</div>
              <h2>¡Pago Exitoso!</h2>
              <p>Tu membresía ha sido activada correctamente. Ya puedes comenzar a usar todas las funciones de Savant Vet.</p>
              <div className="status-actions">
                <button onClick={() => setView('dashboard')} className="btn btn-primary">
                  Ir al Dashboard
                </button>
                <button onClick={() => setView('new-consultation')} className="btn btn-secondary">
                  Nueva Consulta
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="status-card error">
              <div className="status-icon">❌</div>
              <h2>Error en el Pago</h2>
              <p>Hubo un problema procesando tu pago. Por favor, intenta nuevamente.</p>
              <div className="status-actions">
                <button onClick={() => setView('membership')} className="btn btn-primary">
                  Intentar Nuevamente
                </button>
                <button onClick={() => setView('dashboard')} className="btn btn-secondary">
                  Volver al Dashboard
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'expired' && (
            <div className="status-card error">
              <div className="status-icon">⌛</div>
              <h2>Sesión Expirada</h2>
              <p>La sesión de pago ha expirado. Por favor, inicia el proceso nuevamente.</p>
              <div className="status-actions">
                <button onClick={() => setView('membership')} className="btn btn-primary">
                  Volver a Membresías
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'timeout' && (
            <div className="status-card error">
              <div className="status-icon">⏰</div>
              <h2>Tiempo Agotado</h2>
              <p>No pudimos verificar el estado del pago. Revisa tu email para confirmación o contacta soporte.</p>
              <div className="status-actions">
                <button onClick={() => setView('dashboard')} className="btn btn-secondary">
                  Ir al Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Page
const Profile = ({ setView }) => {
  const { veterinarian } = useVet();

  return (
    <div className="profile-page">
      <Header setView={setView} />
      
      <div className="container">
        <div className="page-header">
          <h1>Perfil Profesional</h1>
          <p>Información de tu cuenta veterinaria</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {veterinarian.nombre.charAt(0)}
              </div>
              <div className="profile-info">
                <h2>{veterinarian.nombre}</h2>
                <p>{veterinarian.especialidad}</p>
                <span className={`verification-status ${veterinarian.verified ? 'verified' : 'pending'}`}>
                  {veterinarian.verified ? '✅ Verificado' : '⏳ Pendiente de verificación'}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{veterinarian.email}</span>
              </div>
              <div className="detail-row">
                <strong>Teléfono:</strong>
                <span>{veterinarian.telefono}</span>
              </div>
              <div className="detail-row">
                <strong>Cédula Profesional:</strong>
                <span>{veterinarian.cedula_profesional}</span>
              </div>
              <div className="detail-row">
                <strong>Años de Experiencia:</strong>
                <span>{veterinarian.años_experiencia} años</span>
              </div>
              <div className="detail-row">
                <strong>Institución:</strong>
                <span>{veterinarian.institucion}</span>
              </div>
              <div className="detail-row">
                <strong>Miembro desde:</strong>
                <span>{new Date(veterinarian.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;