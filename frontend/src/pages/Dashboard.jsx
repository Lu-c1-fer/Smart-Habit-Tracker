import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabits, createHabit, deleteHabit, completeHabit, updateHabit } from '../lib/habits';
import styles from './Dashboard.module.css';

// ─── HELPERS ───
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌙' };
};

const getMotivationalQuote = () => {
  const quotes = [
    "Small steps every day lead to big changes. Keep going! 💪",
    "You're building the best version of yourself, one habit at a time. 🌱",
    "Consistency is the key to greatness. You've got this! 🔑",
    "Every habit you complete today is an investment in tomorrow. 📈",
    "Progress, not perfection. Keep showing up! 🎯",
    "The secret of your future is hidden in your daily routine. ✨",
    "Champions aren't born — they're built through daily habits. 🏆",
  ];
  const day = new Date().getDay();
  return quotes[day % quotes.length];
};

const getStreakBadge = (streak) => {
  if (streak >= 365) return { label: '1 Year!', emoji: '👑', color: '#f9c74f' };
  if (streak >= 100) return { label: '100 Days!', emoji: '💎', color: '#4cc9f0' };
  if (streak >= 30) return { label: '30 Days!', emoji: '🏆', color: '#f9c74f' };
  if (streak >= 14) return { label: '2 Weeks!', emoji: '🥇', color: '#f9c74f' };
  if (streak >= 7) return { label: '7 Days!', emoji: '🔥', color: '#f59e0b' };
  if (streak >= 3) return { label: '3 Days!', emoji: '⚡', color: '#9b5de5' };
  return null;
};

// ─── MODAL ───
const HabitModal = ({ onClose, onSubmit, loading, initial }) => {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    frequency: initial?.frequency || 'daily',
    reminderTime: initial?.reminder_time || '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {
      title: form.title,
      frequency: form.frequency,
      ...(form.description && { description: form.description }),
      ...(form.reminderTime && { reminderTime: form.reminderTime }),
    };
    onSubmit(cleaned);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {initial ? '✏️ Edit Habit' : '✨ New Habit'}
        </h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title *</label>
            <input
              className={styles.input}
              name="title"
              type="text"
              placeholder="e.g. Morning run"
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              placeholder="What's this habit about? (optional)"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Frequency</label>
            <select
              className={styles.select}
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Reminder Time (optional)</label>
            <input
              className={styles.input}
              name="reminderTime"
              type="time"
              value={form.reminderTime}
              onChange={handleChange}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : initial ? 'Save Changes' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── DASHBOARD ───
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchHabits = async () => {
    try {
      const { data } = await getHabits();
      setHabits(data.data.habits);
      setTotalHabits(data.data.totalHabits);
    } catch (err) {
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleAdd = async (form) => {
    setSubmitting(true);
    try {
      await createHabit(form);
      await fetchHabits();
      setShowModal(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (form) => {
    setSubmitting(true);
    try {
      await updateHabit(editingHabit.id, form);
      await fetchHabits();
      setEditingHabit(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update habit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      await fetchHabits();
    } catch (err) {
      setError('Failed to delete habit');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeHabit(id);
      await fetchHabits();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete habit');
    }
  };

  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const completedToday = habits.filter(h => h.completedToday).length;
  const progressPct = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const greeting = getGreeting();

  const progressMsg = () => {
    if (progressPct === 100) return "🎉 You crushed it today! All habits done!";
    if (progressPct >= 50) return "💪 Over halfway there, keep pushing!";
    if (progressPct > 0) return "🌱 Great start! Keep the momentum going!";
    return "👋 Start your day by completing a habit!";
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '32px' }}>
      ⏳
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Navbar */}
        <nav className={styles.nav}>
          <div className={styles.navBrand}>
            🌿 Habit<span>Tracker</span>
          </div>
          <div className={styles.navRight}>
            <span className={styles.navUser}>
              Hey, <strong>{user?.name?.split(' ')[0]}</strong> 👋
            </span>
            <button className={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </nav>

        {/* Greeting Banner */}
        <div className={styles.greeting}>
          <div className={styles.greetingLeft}>
            <h2 className={styles.greetingTitle}>
              {greeting.text}, <span>{user?.name?.split(' ')[0]}!</span>
            </h2>
            <p className={styles.greetingQuote}>{getMotivationalQuote()}</p>
          </div>
          <span className={styles.greetingEmoji}>{greeting.emoji}</span>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTop}>
            <span className={styles.progressLabel}>📊 Today's Progress</span>
            <span className={styles.progressPct}>{completedToday}/{totalHabits} habits</span>
          </div>
          <div className={styles.progressBarOuter}>
            <div className={styles.progressBarInner} style={{ width: `${progressPct}%` }} />
          </div>
          <p className={styles.progressMsg}>{progressMsg()}</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>📋</span>
            <span className={styles.statVal} style={{ color: 'var(--blue)' }}>{totalHabits}</span>
            <span className={styles.statLabel}>Total Habits</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>🔥</span>
            <span className={styles.statVal} style={{ color: 'var(--amber)' }}>{bestStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>✅</span>
            <span className={styles.statVal} style={{ color: 'var(--green)' }}>{completedToday}</span>
            <span className={styles.statLabel}>Done Today</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🎯 Your Habits</h2>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Habit
          </button>
        </div>

        {/* Habits */}
        {habits.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🌱</span>
            <h3 className={styles.emptyTitle}>No habits yet!</h3>
            <p className={styles.emptySubtitle}>Click "Add Habit" to start your streak today</p>
          </div>
        ) : (
          <div className={styles.habitsGrid}>
            {habits.map(habit => {
              const badge = getStreakBadge(habit.streak);
              return (
                <div
                  key={habit.id}
                  className={`${styles.habitCard} ${habit.completedToday ? styles.completed : ''}`}
                >
                  <div className={styles.habitTop}>
                    <h3 className={styles.habitTitle}>{habit.title}</h3>
                    <span className={styles.habitFreq}>{habit.frequency || 'daily'}</span>
                  </div>

                  {habit.description && (
                    <p className={styles.habitDesc}>{habit.description}</p>
                  )}

                  <div className={styles.habitStats}>
                    <div className={styles.habitStat}>
                      <span>🔥</span>
                      <span className={habit.streak > 0 ? styles.streakHot : ''}>
                        <strong>{habit.streak}</strong> day streak
                      </span>
                      {badge && (
                        <span
                          className={styles.streakBadge}
                          style={{
                            background: `${badge.color}22`,
                            color: badge.color,
                            border: `1px solid ${badge.color}44`
                          }}
                        >
                          {badge.emoji} {badge.label}
                        </span>
                      )}
                    </div>
                    <div className={styles.habitStat}>
                      <span>📝</span>
                      <span><strong>{habit.totalLogs}</strong> total</span>
                    </div>
                    {habit.reminder_time && (
                      <div className={styles.habitStat}>
                        <span>⏰</span>
                        <span>{habit.reminder_time}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.habitActions}>
                    <button
                      className={`${styles.completeBtn} ${habit.completedToday ? styles.done : ''}`}
                      onClick={() => handleComplete(habit.id)}
                      disabled={habit.completedToday}
                    >
                      {habit.completedToday ? '✓ Done today!' : '✓ Complete'}
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.edit}`}
                      onClick={() => setEditingHabit(habit)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.delete}`}
                      onClick={() => handleDelete(habit.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <HabitModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
          loading={submitting}
        />
      )}

      {/* Edit Modal */}
      {editingHabit && (
        <HabitModal
          onClose={() => setEditingHabit(null)}
          onSubmit={handleEdit}
          loading={submitting}
          initial={editingHabit}
        />
      )}
    </div>
  );
};

export default Dashboard;