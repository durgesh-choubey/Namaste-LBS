import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import StudentLogin from './components/StudentLogin';
import AdminLogin from './components/AdminLogin';
import StudentSignup from './components/StudentSignup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import BookingModal from './components/BookingModal';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roomNo?: string;
  courseName?: string;
  departmentName?: string;
  role: 'student' | 'admin';
}

export interface Booking {
  id: string;
  userId: string;
  machineId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Notification {
  id: string;
  subject: string;
  message: string;
  timestamp: string;
  media?: string;
  media_type?: string;
}

type View = 'home' | 'student-login' | 'admin-login' | 'student-signup' | 'dashboard' | 'admin-dashboard';

type ToastMessage = {
  message: string;
  type: 'success' | 'error';
} | null;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('home');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudentData = useCallback(async (studentId: string) => {
    try {
      const [bookingsRes, notificationsRes] = await Promise.all([
        fetch(`http://localhost:3001/api/bookings/user/${studentId}`),
        fetch('http://localhost:3001/api/notifications'),
      ]);
      if (!bookingsRes.ok || !notificationsRes.ok) throw new Error('Failed to fetch user data');
      const bookingsData = await bookingsRes.json();
      const notificationsData = await notificationsRes.json();
      setBookings(bookingsData);
      setNotifications(notificationsData);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        setView('admin-dashboard');
      } else {
        setView('dashboard');
        fetchStudentData(parsedUser.id);
      }
    }
    setIsLoading(false);
  }, [fetchStudentData]);

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setView('admin-dashboard');
    } else {
      setView('dashboard');
      fetchStudentData(loggedInUser.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };
  
  const handleStudentLogin = async (credentials: { phone: string, password: string }) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      handleLogin(data.user);
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };
  
  const handleAdminLogin = async (credentials: { email: string, password: string }) => {
    try {
       const response = await fetch('http://localhost:3001/api/auth/login/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      handleLogin(data.user);
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };
  
  const handleSignup = async (details: Omit<User, 'id' | 'role'> & { password?: string }) => {
    try {
        const response = await fetch('http://localhost:3001/api/auth/signup/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        showToast('Signup successful! Please log in.', 'success');
        setView('student-login');
    } catch (error: any) {
        showToast(error.message, 'error');
        throw error;
    }
  };

  const handleBook = async (newBooking: Omit<Booking, 'id' | 'status' | 'userId'>) => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBooking, userId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      showToast('Booking successful!', 'success');
      setIsBookingModalOpen(false);
      fetchStudentData(user.id);
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel booking.');
      }
      showToast('Booking cancelled successfully.', 'success');
      fetchStudentData(user.id);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleUpdateUser = async (updatedDetails: Partial<User>) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDetails)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
       showToast(error.message, 'error');
       throw error;
    }
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex-grow flex items-center justify-center">Loading...</div>;
    
    switch (view) {
      case 'home':
        return <Hero onSelectLogin={(role) => setView(role === 'student' ? 'student-login' : 'admin-login')} />;
      case 'student-login':
        return <StudentLogin onLogin={handleStudentLogin} onSwitchToSignup={() => setView('student-signup')} onBack={() => setView('home')} />;
      case 'admin-login':
        return <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('home')} />;
      case 'student-signup':
          return <StudentSignup onSignup={handleSignup} onSwitchToLogin={() => setView('student-login')} onBack={() => setView('home')} />;
      case 'dashboard':
        if (user && user.role === 'student') {
          return <Dashboard 
            user={user} 
            bookings={bookings} 
            notifications={notifications} 
            onLogout={handleLogout}
            onBookNow={() => setIsBookingModalOpen(true)}
            onCancelBooking={handleCancelBooking}
            onUpdateUser={handleUpdateUser}
            showToast={showToast}
          />;
        }
        return <Hero onSelectLogin={(role) => setView(role === 'student' ? 'student-login' : 'admin-login')} />;
      case 'admin-dashboard':
        return <AdminDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
      default:
        return <Hero onSelectLogin={(role) => setView(role === 'student' ? 'student-login' : 'admin-login')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      {view === 'home' && <Footer />}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBook={handleBook}
        showToast={showToast}
      />
    </div>
  );
};

export default App;
