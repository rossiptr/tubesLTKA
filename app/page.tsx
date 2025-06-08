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
  { value: 'amazing', label: 'Amazing', icon: <Star size={20} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { value: 'happy', label: 'Happy', icon: <Smile size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'good', label: 'Good', icon: <Sun size={20} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'okay', label: 'Okay', icon: <Meh size={20} />, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  { value: 'sad', label: 'Sad', icon: <CloudRain size={20} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { value: 'angry', label: 'Angry', icon: <Zap size={20} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
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
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Heart color="#ec4899" size={40} fill="#ec4899" />
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>My Mood Tracker</h1>
          <p style={{
            fontSize: '1rem',
            color: '#4b5563',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>Track your daily emotions and build better mental health habits</p>
        </div>

        {/* Stats Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <Calendar color="#3b82f6" size={22} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>Weekly Summary ({stats.total} entries)</h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem'
          }}>
            {moodOptions.slice(0, 4).map(mood => {
              const count = stats.counts[mood.value] || 0;
              return (
                <div key={mood.value} style={{
                  background: mood.bg,
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  border: `1px solid rgba(255,255,255,0.3)`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    color: mood.color
                  }}>
                    {mood.icon}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>{mood.label}</div>
                  <div style={{
                    fontSize: '1.25rem',
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
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>How are you feeling today?</h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Date Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255,255,255,0.7)',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>Select your mood</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem'
              }}>
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `1px solid ${selectedMood === mood.value ? mood.color : '#e5e7eb'}`,
                      background: selectedMood === mood.value ? mood.bg : 'rgba(255,255,255,0.7)',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: selectedMood === mood.value ? `0 0 0 3px ${mood.color}20` : 'none'
                    }}
                  >
                    <div style={{ color: mood.color }}>
                      {mood.icon}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}>{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Any specific reason for this mood?"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  minHeight: '100px',
                  resize: 'vertical',
                  background: 'rgba(255,255,255,0.7)',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                rows={3}
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
                padding: '0.875rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: selectedMood ? 1 : 0.7,
                boxShadow: selectedMood ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none',
                marginTop: '0.5rem'
              }}
            >
              Save Mood Entry
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>Mood History</h3>
          
          {moods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 0',
              color: '#6b7280'
            }}>
              <Smile size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
              <p>No mood entries yet. Start tracking your emotions!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {moods.slice(0, 10).map(mood => {
                const moodData = moodOptions.find(m => m.value === mood.mood) || moodOptions[3];
                return (
                  <div key={mood.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{
                      background: moodData.bg,
                      padding: '0.5rem',
                      borderRadius: '8px',
                      color: moodData.color,
                      flexShrink: 0
                    }}>
                      {moodData.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          textTransform: 'capitalize'
                        }}>{mood.mood}</span>
                        <ChevronRight size={14} color="#9ca3af" />
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>{mood.date}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          background: 'rgba(0,0,0,0.03)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px'
                        }}>{mood.timestamp}</span>
                      </div>
                      {mood.note && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#4b5563',
                          margin: 0,
                          lineHeight: '1.5'
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
                        padding: '0.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      aria-label="Delete entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
              
              {moods.length > 10 && (
                <div style={{
                  textAlign: 'center',
                  paddingTop: '1rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <p>Showing latest 10 entries of {moods.length} total</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
