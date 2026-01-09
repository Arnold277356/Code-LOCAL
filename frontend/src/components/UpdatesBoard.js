import React, { useState } from 'react';
import './UpdatesBoard.css';

function UpdatesBoard({ announcements }) {
  const [filter, setFilter] = useState('all');

  // Sample announcements if none provided
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
      content: 'The Community Center drop-off point will be temporarily closed on December 25-26 for maintenance. Please use alternative locations.',
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

  const filteredAnnouncements = filter === 'all' 
    ? displayAnnouncements 
    : displayAnnouncements.filter(a => a.type === filter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'collection':
        return 'type-collection';
      case 'notice':
        return 'type-notice';
      case 'announcement':
        return 'type-announcement';
      default:
        return 'type-announcement';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'collection':
        return '📅 Collection';
      case 'notice':
        return '⚠️ Notice';
      case 'announcement':
        return '📢 Announcement';
      default:
        return '📢 Update';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section id="updates" className="updates-board">
      <div className="container">
        <h2 className="section-title">Collection Updates & Announcements</h2>
        <p className="section-subtitle">
          Stay informed about collection schedules and important notices
        </p>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Updates
          </button>
          <button
            className={`filter-btn ${filter === 'collection' ? 'active' : ''}`}
            onClick={() => setFilter('collection')}
          >
            Collection
          </button>
          <button
            className={`filter-btn ${filter === 'notice' ? 'active' : ''}`}
            onClick={() => setFilter('notice')}
          >
            Notices
          </button>
          <button
            className={`filter-btn ${filter === 'announcement' ? 'active' : ''}`}
            onClick={() => setFilter('announcement')}
          >
            Announcements
          </button>
        </div>

        <div className="announcements-container">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className={`announcement-card ${getTypeColor(announcement.type)}`}>
                <div className="announcement-header">
                  <span className="announcement-type">
                    {getTypeLabel(announcement.type)}
                  </span>
                  <span className="announcement-date">
                    {formatDate(announcement.created_at)}
                  </span>
                </div>
                <h3 className="announcement-title">{announcement.title}</h3>
                <p className="announcement-content">{announcement.content}</p>
              </div>
            ))
          ) : (
            <div className="no-announcements">
              <p>No announcements at this time. Check back soon!</p>
            </div>
          )}
        </div>

        <div className="updates-note">
          <p>
            <strong>💡 Tip:</strong> Follow our Barangay Facebook page for real-time updates and announcements. You can also visit the Barangay Hall for more information.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UpdatesBoard;
