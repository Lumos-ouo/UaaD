import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, User, Settings, Bell, Calendar, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/activities/recent')
        ]);
        setStats(statsRes.data);
        if (activitiesRes.status === 202) {
          setError(activitiesRes.data.error || 'Queueing...');
        } else {
          setActivities(activitiesRes.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.overview'), id: 'overview', active: true },
    { icon: Calendar, label: t('dashboard.activities'), id: 'activities', active: false },
    { icon: Bell, label: t('dashboard.notifications'), id: 'notifications', active: false },
    { icon: User, label: t('dashboard.profile'), id: 'profile', active: false },
    { icon: Settings, label: t('dashboard.settings'), id: 'settings', active: false },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-slate-800 bg-slate-900/20 backdrop-blur-md flex flex-col p-4"
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">U</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            UAAD Platform
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all font-medium mt-auto"
        >
          <LogOut size={20} />
          {t('dashboard.logout')}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('dashboard.overview')}</h2>
            <p className="text-slate-400">{t('dashboard.welcome')}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="p-2 bg-slate-900/50 border border-slate-800 rounded-lg relative cursor-pointer hover:bg-slate-800">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full cursor-pointer ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-950"></div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5 backdrop-blur-sm shadow-xl`}
              >
                <h3 className="text-slate-400 font-medium mb-1">{stat.label}</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">{t('dashboard.highlights')}</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-slate-500 animate-spin" /></div>
          ) : error ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
               {error}
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-800/30 hover:border-blue-500/30 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                     <div className="w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-500/50"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{activity.title}</h4>
                    <p className="text-sm text-slate-400">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{activity.date}</p>
                    <p className="text-sm text-blue-400">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
