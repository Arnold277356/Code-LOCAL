import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './UpdatesPage.css';

function UpdatesPage({ announcements }) {
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();

  const defaultAnnouncements = [
    {
      id: 1,
      title: 'Extended Collection Hours This Weekend',
      content: 'All drop-off centers will be open from 8:00 AM to 7:00 PM this Saturday and Sunday to accommodate more residents.',
      type: 'collection',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Temporary Closure Notice',
      content: 'The Community Center drop-off point will be temporarily closed on December 25-26 for maintenance.',
      type: 'notice',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: 'New E-waste Categories Accepted',
      content: 'We now accept solar panels and LED lights! Please bring them to any of our drop-off centers.',
      type: 'announcement',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const displayAnnouncements = announcements && announcements.length > 0 ? announcements : defaultAnnouncements;
  const filteredAnnouncements = filter === 'all' ? displayAnnouncements : displayAnnouncements.filter(a => a.type === filter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'collection': return 'type-collection';
      case 'notice': return 'type-notice';
      case 'announcement': return 'type-announcement';
      default: return 'type-announcement';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'collection': return '📅 Collection';
      case 'notice': return '⚠️ Notice';
      case 'announcement': return '📢 Announcement';
      default: return '📢 Update';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container">
      <section className="updates-page">
        <div className="container">
          <h1 className="page-title">{t.updates.title}</h1>
          <p className="page-subtitle">{t.updates.subtitle}</p>

          <div className="filter-buttons">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{t.updates.all}</button>
            <button className={`filter-btn ${filter === 'collection' ? 'active' : ''}`} onClick={() => setFilter('collection')}>{t.updates.collection}</button>
            <button className={`filter-btn ${filter === 'notice' ? 'active' : ''}`} onClick={() => setFilter('notice')}>{t.updates.notices}</button>
            <button className={`filter-btn ${filter === 'announcement' ? 'active' : ''}`} onClick={() => setFilter('announcement')}>{t.updates.announcements}</button>
          </div>

          <div className="announcements-container">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className={`announcement-card ${getTypeColor(announcement.type)}`}>
                  <div className="announcement-header">
                    <span className="announcement-type">{getTypeLabel(announcement.type)}</span>
                    <span className="announcement-date">{formatDate(announcement.created_at)}</span>
                  </div>
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <p className="announcement-content">{announcement.content}</p>
                </div>
              ))
            ) : (
              <div className="no-announcements">
                <p>{t.updates.noAnnouncements}</p>
              </div>
            )}
          </div>

          <div className="updates-note">
            <p><strong>{t.updates.tip}</strong> {t.updates.tipText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UpdatesPage;