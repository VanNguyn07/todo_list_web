import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Zap,
  CheckSquare,
  Clock,
  Trophy,
  Edit2,
  ChevronRight,
  Shield,
  Camera,
} from "lucide-react";
import "./ProfileModal.css";

export const ProfileModal = ({ isOpen, onClose, username: usernameProp, onLogout, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(usernameProp || "");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Achievements with emoji icons + descriptions
  const achievements = [
    { icon: "🚀", label: "First Step", status: "unlocked", desc: "Completed your first task", progress: 100 },
    { icon: "🔥", label: "On Fire", status: "unlocked", desc: "7-day task streak", progress: 100 },
    { icon: "⭐", label: "50 Tasks", status: "unlocked", desc: "Marked 50 tasks complete", progress: 100 },
    { icon: "💯", label: "Perfect Day", status: "unlocked", desc: "100% completion rate", progress: 100 },
    { icon: "👑", label: "Master", status: "in-progress", desc: "Reach 500 tasks", progress: 45 },
    { icon: "✨", label: "Legend", status: "locked", desc: "Ultimate achievement", progress: 0 },
  ];

  // User stats
  const [userStats] = useState({
    streakCount: 14,
    completedTasks: 227,
    pendingTasks: 8,
    joinDate: "Jan 15, 2025",
    totalTasks: 235,
    completedToday: 5,
    completionRate: 96,
    avgTimePerTaskMin: 18,
  });

  // Recent activities
  const [recentActivities] = useState([
    { 
      id: 1, 
      action: "Completed", 
      item: "Write project spec",
      time: "2 hours ago", 
      icon: CheckSquare,
      color: "#10b981"
    },
    { 
      id: 2, 
      action: "Added habit", 
      item: "Morning run",
      time: "1 day ago", 
      icon: Zap,
      color: "#f59e0b"
    },
    { 
      id: 3, 
      action: "Updated deadline", 
      item: "Prepare slides",
      time: "2 days ago", 
      icon: Clock,
      color: "#3b82f6"
    },
    { 
      id: 4, 
      action: "Earned badge", 
      item: "On Fire 🔥",
      time: "3 days ago", 
      icon: Trophy,
      color: "#8b5cf6"
    },
  ]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("my_email");
    const storedAvatar = localStorage.getItem("my_avatar");
    const storedCover = localStorage.getItem("my_cover");

    if (usernameProp) setEditUsername(usernameProp);
    if (storedEmail) setEmail(storedEmail);
    if (storedAvatar) setAvatarUrl(storedAvatar);
    if (storedCover) setCoverUrl(storedCover);
  }, [isOpen, usernameProp]);

  const handleCoverChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCoverUrl(reader.result);
      localStorage.setItem("my_cover", reader.result);
    };
    reader.readAsDataURL(f);
  };

  const handleAvatarChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      localStorage.setItem("my_avatar", reader.result);
    };
    reader.readAsDataURL(f);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("my_username", editUsername);
      localStorage.setItem("my_email", email);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsSaving(false);
      setIsEditing(false);
      if (typeof onUpdate === "function") onUpdate({ username: editUsername, email });
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* COVER PHOTO SECTION */}
        <div className="profile-cover-section">
          {coverUrl ? (
            <img src={coverUrl} alt="cover" className="cover-image" />
          ) : (
            <div className="cover-placeholder"></div>
          )}
          <label className="cover-upload-btn">
            <Camera size={18} />
            <span>Edit Cover</span>
            <input type="file" accept="image/*" onChange={handleCoverChange} style={{display: 'none'}} />
          </label>
        </div>

        {/* PROFILE INFO SECTION (Avatar overlapping cover) */}
        <div className="profile-info-section">
          <div className="profile-avatar-large">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              <div className="avatar-placeholder-large">
                <User size={48} />
              </div>
            )}
            <label className="avatar-edit-btn">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{display: 'none'}} />
            </label>
          </div>

          <div className="profile-user-info">
            {isEditing ? (
              <div className="edit-form-inline">
                <input
                  className="input-field-modern"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                  autoFocus
                />
                <input
                  className="input-field-modern"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
                <div className="edit-actions-inline">
                  <button onClick={handleSaveProfile} disabled={isSaving} className="btn-save-modern">
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-cancel-modern">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="user-name-row">
                  <h2 className="user-name-large">{editUsername || "User"}</h2>
                  <button onClick={() => setIsEditing(true)} className="btn-edit-modern">
                    <Edit2 size={16} />
                  </button>
                </div>
                <p className="user-email-modern">
                  <Mail size={14} />
                  {email || "Add your email"}
                </p>
                <p className="user-join-date">
                  <Calendar size={14} />
                  Joined {userStats.joinDate}
                </p>
              </>
            )}
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="profile-modal-body-modern">

          {/* STATS GRID */}
          <div className="stats-grid-modern">
            <div className="stat-card-modern streak-card">
              <div className="stat-icon-modern">
                <Zap size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{userStats.streakCount}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
            <div className="stat-card-modern completed-card">
              <div className="stat-icon-modern">
                <CheckSquare size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{userStats.completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card-modern pending-card">
              <div className="stat-icon-modern">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{userStats.pendingTasks}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card-modern completion-card">
              <div className="stat-icon-modern">
                <Trophy size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{userStats.completionRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="section-header-modern">
            <h3>Achievements</h3>
            <span className="section-subtitle">{achievements.filter(a => a.status === 'unlocked').length} of {achievements.length} unlocked</span>
          </div>
          <div className="achievements-grid-modern">
            {achievements.map((item, idx) => (
              <div key={idx} className={`achievement-card-modern ${item.status}`}>
                <div className="achievement-emoji">{item.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{item.label}</div>
                  <div className="achievement-description">{item.desc}</div>
                  {item.status === 'in-progress' && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${item.progress}%`}}></div>
                      </div>
                      <span className="progress-text">{item.progress}%</span>
                    </div>
                  )}
                </div>
                {item.status === 'unlocked' && <div className="unlocked-badge">✓</div>}
              </div>
            ))}
          </div>

          {/* RECENT ACTIVITIES */}
          <div className="section-header-modern">
            <h3>Recent Activity</h3>
            <span className="section-subtitle">Last 7 days</span>
          </div>
          <div className="activities-list-modern">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="activity-card-modern">
                  <div className="activity-icon-modern" style={{backgroundColor: act.color + '20', color: act.color}}>
                    <Icon size={18} />
                  </div>
                  <div className="activity-details">
                    <div className="activity-main">
                      <span className="activity-action">{act.action}</span>
                      <span className="activity-item">"{act.item}"</span>
                    </div>
                    <div className="activity-timestamp">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SETTINGS */}
          <div className="section-header-modern">
            <h3>Settings</h3>
          </div>
          <div className="settings-list-modern">
            <button className="setting-item-modern">
              <div className="setting-icon-modern" style={{backgroundColor: '#3b82f620', color: '#3b82f6'}}>
                <User size={18} />
              </div>
              <div className="setting-text">
                <div className="setting-title">Personal Information</div>
                <div className="setting-desc">Update your details and preferences</div>
              </div>
              <ChevronRight size={18} className="setting-arrow" />
            </button>
            <button className="setting-item-modern">
              <div className="setting-icon-modern" style={{backgroundColor: '#10b98120', color: '#10b981'}}>
                <Shield size={18} />
              </div>
              <div className="setting-text">
                <div className="setting-title">Security & Password</div>
                <div className="setting-desc">Manage your account security</div>
              </div>
              <ChevronRight size={18} className="setting-arrow" />
            </button>
            <button className="setting-item-modern">
              <div className="setting-icon-modern" style={{backgroundColor: '#8b5cf620', color: '#8b5cf6'}}>
                <Settings size={18} />
              </div>
              <div className="setting-text">
                <div className="setting-title">App Preferences</div>
                <div className="setting-desc">Customize your experience</div>
              </div>
              <ChevronRight size={18} className="setting-arrow" />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="profile-modal-footer-modern">
          <button onClick={() => { if (typeof onLogout === "function") onLogout(); }} className="btn-logout-modern">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};