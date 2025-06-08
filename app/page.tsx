"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar, Smile, Frown, Meh, Heart, Star,
  Sun, Cloud, CloudRain, Zap, Trash2, ChevronRight
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
        width: '95%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        height: '90vh'
      }}>
        {/* Left Column - Header and Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: '100%'
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

          {/* Stats Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)',
            flex: '0 0 auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <Calendar color="#3b82f6" size={18} />
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>Weekly Summary ({stats.total})</h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem'
            }}>
              {moodOptions.slice(0,4).map(mood => {
                const count = stats.counts[mood.value] || 0;
                return (
                  <div key={mood.value} style={{
                    background: mood.bg,
                    borderRadius: '8px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    border: `1px solid rgba(255,255,255,0.3)`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      marginBottom: '0.25rem',
                      color: mood.color
                    }}>
                      {mood.icon}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>{mood.label}</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#111827'
                    }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Mood Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>How are you feeling today?</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {/* Date Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>Date</label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: 'rgba(255,255,255,0.7)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Mood Selection */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>Mood</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem'
                }}>
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${selectedMood === mood.value ? mood.color : '#e5e7eb'}`,
                        background: selectedMood === mood.value ? mood.bg : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <div style={{ color: mood.color }}>
                        {mood.icon}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '500',
                        color: '#374151'
                      }}>{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: 'rgba(255,255,255,0.7)',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveMood}
                disabled={!selectedMood}
                style={{
                  width: '100%',
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
                  opacity: selectedMood ? 1 : 0.7,
                  marginTop: 'auto'
                }}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Mood History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Recent Entries</h3>
          
          {moods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1rem 0',
              color: '#6b7280',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Smile size={32} color="#d1d5db" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.875rem' }}>No entries yet</p>
            </div>
          ) : (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              overflowY: 'auto',
              flex: 1,
              paddingRight: '0.25rem'
            }}>
              {moods.slice(0, 8).map(mood => {
                const moodData = moodOptions.find(m => m.value === mood.mood) || moodOptions[3];
                return (
                  <div key={mood.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      background: moodData.bg,
                      padding: '0.25rem',
                      borderRadius: '6px',
                      color: moodData.color,
                      flexShrink: 0,
                      display: 'flex'
                    }}>
                      {moodData.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.125rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          textTransform: 'capitalize',
                          fontSize: '0.8125rem'
                        }}>{mood.mood}</span>
                        <ChevronRight size={12} color="#9ca3af" />
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>{mood.date}</span>
                      </div>
                      {mood.note && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#4b5563',
                          margin: 0,
                          lineHeight: '1.4',
                          wordBreak: 'break-word'
                        }}>{mood.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMood(mood.id)}
                      style={{
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}
                      aria-label="Delete entry"
                    >
                      <Trash2 size={14} />
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
