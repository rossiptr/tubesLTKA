"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar, Smile, Frown, Meh, Heart, Star,
  Sun, CloudRain, Zap, Trash2, ChevronRight
} from 'lucide-react';

type Mood = {
  id: number;
  mood: string;
  note: string;
  date: string;
  timestamp: string;
};

type MoodOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
};

const moodOptions: MoodOption[] = [
  { value: 'amazing', label: 'Amazing', icon: <Star size={16} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { value: 'happy', label: 'Happy', icon: <Smile size={16} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'good', label: 'Good', icon: <Sun size={16} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'okay', label: 'Okay', icon: <Meh size={16} />, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  { value: 'sad', label: 'Sad', icon: <CloudRain size={16} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { value: 'angry', label: 'Angry', icon: <Zap size={16} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  { value: 'anxious', label: 'Anxious', icon: <Frown size={16} />, color: '#d946ef', bg: 'rgba(217, 70, 239, 0.1)' }
];

export default function MoodTracker() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedMoods = JSON.parse(localStorage.getItem('moods') || '[]');
    setMoods(savedMoods);
  }, []);

  const saveMood = () => {
    if (!selectedMood) return;

    const newMood: Mood = {
      id: Date.now(),
      mood: selectedMood,
      note,
      date: currentDate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMoods = [newMood, ...moods];
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
    setSelectedMood('');
    setNote('');
  };

  const deleteMood = (id: number) => {
    const updatedMoods = moods.filter(mood => mood.id !== id);
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
  };

  const getMoodStats = () => {
    const last7Days = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });

    const moodCounts: Record<string, number> = {};
    last7Days.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    return { total: last7Days.length, counts: moodCounts };
  };

  const stats = getMoodStats();
  const selectedMoodData = moodOptions.find(opt => opt.value === selectedMood) || moodOptions[3];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      padding: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1rem',
        height: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Heart color="#ec4899" size={24} fill="#ec4899" />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>My Mood Tracker</h1>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            margin: '0.25rem 0 0'
          }}>Track your daily emotions</p>
        </div>

        {/* Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>How are you feeling today?</h3>

            <label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '1rem'
              }}
            />

            <label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Mood</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `2px solid ${selectedMood === mood.value ? mood.color : 'transparent'}`,
                    background: selectedMood === mood.value ? mood.bg : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ color: mood.color }}>{mood.icon}</div>
                  <div style={{ fontSize: '0.7rem', color: '#374151' }}>{mood.label}</div>
                </button>
              ))}
            </div>

            <label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind? Any spesific reason for this mood?"
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '1rem',
                resize: 'vertical',
                minHeight: '60px'
              }}
            />

            <button
              onClick={saveMood}
              disabled={!selectedMood}
              style={{
                background: selectedMood
                  ? `linear-gradient(135deg, ${selectedMoodData.color} 0%, #ec4899 100%)`
                  : '#e5e7eb',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                border: 'none',
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                opacity: selectedMood ? 1 : 0.6
              }}
            >
              Save Entry
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Recent Entries</h3>
          {moods.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af' }}>No entries yet 😔</p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {moods.slice(0, 10).map(mood => {
                const moodData = moodOptions.find(m => m.value === mood.mood) || moodOptions[3];
                return (
                  <div key={mood.id} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.7)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      background: moodData.bg,
                      padding: '0.25rem',
                      borderRadius: '6px',
                      color: moodData.color
                    }}>
                      {moodData.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' }}>
                        {mood.mood} <span style={{ color: '#6b7280', fontWeight: 400 }}>• {mood.date}</span>
                      </div>
                      {mood.note && (
                        <p style={{
                          fontSize: '0.75rem',
                          margin: 0,
                          color: '#4b5563'
                        }}>{mood.note}</p>
                      )}
                    </div>
                    <button onClick={() => deleteMood(mood.id)} style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
