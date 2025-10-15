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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update if at top
      setIsAtTop(currentScrollY < 50);
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHeaderVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${!isHeaderVisible ? 'hidden' : ''} ${isAtTop ? '' : 'transparent'}`}>
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
            <nav className={`nav-menu ${isMenuOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
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
                    <span>{veterinarian.nombre}</span>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="logout-btn">Salir</button>
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
          <div className="hero-content">
            <h1>Consultoría Veterinaria Profesional</h1>
            <p>Plataforma exclusiva para médicos veterinarios certificados. Obtén diagnósticos especializados y planes de tratamiento basados en evidencia científica.</p>
            <div className="hero-actions">
              <button onClick={() => setView('register')} className="btn btn-primary btn-large">
                Comenzar Ahora
              </button>
              <button onClick={() => setView('login')} className="btn btn-secondary btn-large">
                Iniciar Sesión
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-icon">🔬</div>
              <h3>Análisis Especializado</h3>
              <p>Diagnósticos diferenciales y planes de tratamiento personalizados</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>¿Por qué elegir Savant Vet?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🐕</div>
              <h3>Especialización por Especies</h3>
              <p>Sistemas especializados en pequeñas especies, producción, equinos y exóticos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Proceso Estructurado</h3>
              <p>Flujo de consulta en 3 etapas: cuestionario, observaciones clínicas y análisis especializado</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Basado en Evidencia</h3>
              <p>Recomendaciones respaldadas por literatura científica y protocolos actualizados</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Solo para Profesionales</h3>
              <p>Verificación de cédula profesional mexicana para garantizar calidad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Membresías Flexibles</h3>
              <p>Planes adaptados a diferentes volúmenes de consulta y necesidades</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Interfaz Moderna</h3>
              <p>Diseño profesional optimizado para el flujo de trabajo veterinario</p>
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
              Registrarse Gratis
            </button>
          </div>
        </div>
      </section>
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
    // Step 1: Initial questionnaire
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    motivo_consulta: '',
    sintomas: '',
    duracion_sintomas: '',
    tratamientos_previos: '',
    historia_clinica: '',
    // Step 2: Clinical observations
    parametros_vitales: '',
    ambiente_manejo: '',
    laboratorio_estudios: '',
    notas_adicionales: ''
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
            especie: formData.especie,
            raza: formData.raza,
            edad: formData.edad,
            peso: formData.peso
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
          motivo_consulta: formData.motivo_consulta,
          sintomas: formData.sintomas,
          duracion_sintomas: formData.duracion_sintomas,
          tratamientos_previos: formData.tratamientos_previos,
          historia_clinica: formData.historia_clinica,
          parametros_vitales: formData.parametros_vitales,
          ambiente_manejo: formData.ambiente_manejo,
          laboratorio_estudios: formData.laboratorio_estudios,
          notas_adicionales: formData.notas_adicionales
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
                <h3>Información del Paciente</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Especie *</label>
                    <input
                      type="text"
                      required
                      value={formData.especie}
                      onChange={(e) => setFormData({...formData, especie: e.target.value})}
                      placeholder="Canino, Felino, Bovino..."
                    />
                  </div>
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
              </div>

              {/* Moved to step 2 */}

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
                <h3>Motivo de Consulta</h3>
                <div className="form-group">
                  <label>Motivo Principal *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.motivo_consulta}
                    onChange={(e) => setFormData({...formData, motivo_consulta: e.target.value})}
                    placeholder="Describa el motivo principal de la consulta..."
                  />
                </div>

                <div className="form-group">
                  <label>Síntomas Principales *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.sintomas}
                    onChange={(e) => setFormData({...formData, sintomas: e.target.value})}
                    placeholder="Describa los síntomas observados..."
                  />
                </div>

                <div className="form-group">
                  <label>Duración de los Síntomas *</label>
                  <input
                    type="text"
                    required
                    value={formData.duracion_sintomas}
                    onChange={(e) => setFormData({...formData, duracion_sintomas: e.target.value})}
                    placeholder="3 días, 2 semanas, crónico..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Historia y Tratamientos</h3>
                <div className="form-group">
                  <label>Tratamientos Previos</label>
                  <textarea
                    rows={3}
                    value={formData.tratamientos_previos}
                    onChange={(e) => setFormData({...formData, tratamientos_previos: e.target.value})}
                    placeholder="Medicamentos, tratamientos o intervenciones realizadas..."
                  />
                </div>

                <div className="form-group">
                  <label>Historia Clínica Relevante</label>
                  <textarea
                    rows={4}
                    value={formData.historia_clinica}
                    onChange={(e) => setFormData({...formData, historia_clinica: e.target.value})}
                    placeholder="Antecedentes médicos, cirugías previas, condiciones crónicas..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Observaciones Clínicas</h3>
                <div className="form-group">
                  <label>Signos Vitales</label>
                  <textarea
                    rows={3}
                    value={formData.parametros_vitales}
                    onChange={(e) => setFormData({...formData, parametros_vitales: e.target.value})}
                    placeholder="Temperatura, frecuencia cardíaca, frecuencia respiratoria, presión arterial..."
                  />
                </div>

                <div className="form-group">
                  <label>Laboratorio y Estudios</label>
                  <textarea
                    rows={3}
                    value={formData.laboratorio_estudios}
                    onChange={(e) => setFormData({...formData, laboratorio_estudios: e.target.value})}
                    placeholder="Hemograma, bioquímica, radiografías, ecografías, otros estudios..."
                  />
                </div>

                <div className="form-group">
                  <label>Ambiente y Manejo</label>
                  <textarea
                    rows={3}
                    value={formData.ambiente_manejo}
                    onChange={(e) => setFormData({...formData, ambiente_manejo: e.target.value})}
                    placeholder="Condiciones de alojamiento, alimentación, contacto con otros animales..."
                  />
                </div>

                <div className="form-group">
                  <label>Notas Adicionales</label>
                  <textarea
                    rows={3}
                    value={formData.notas_adicionales}
                    onChange={(e) => setFormData({...formData, notas_adicionales: e.target.value})}
                    placeholder="Cualquier información adicional relevante..."
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
                          especie: '', raza: '', edad: '', peso: '',
                          motivo_consulta: '', sintomas: '', duracion_sintomas: '',
                          tratamientos_previos: '', historia_clinica: '',
                          parametros_vitales: '', ambiente_manejo: '',
                          laboratorio_estudios: '', notas_adicionales: ''
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