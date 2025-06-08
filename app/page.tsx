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
  { value: 'amazing', label: 'Luar Biasa', icon: <Star size={20} />, color: '#f59e0b', bg: '#fef3c7' },
  { value: 'happy', label: 'Bahagia', icon: <Smile size={20} />, color: '#10b981', bg: '#d1fae5' },
  { value: 'good', label: 'Baik', icon: <Sun size={20} />, color: '#3b82f6', bg: '#dbeafe' },
  { value: 'okay', label: 'Biasa', icon: <Meh size={20} />, color: '#6b7280', bg: '#f3f4f6' },
  { value: 'sad', label: 'Sedih', icon: <CloudRain size={20} />, color: '#8b5cf6', bg: '#ede9fe' },
  { value: 'angry', label: 'Marah', icon: <Zap size={20} />, color: '#ef4444', bg: '#fee2e2' },
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
      timestamp: new Date().toLocaleTimeString(),
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <Heart color="#ec4899" size={32} />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>Pencatat Mood Harian</h1>
        </div>

        {/* Stats Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Calendar color="#3b82f6" size={20} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>Ringkasan Mingguan ({stats.total} entri)</h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {moodOptions.slice(0, 4).map(mood => {
              const count = stats.counts[mood.value] || 0;
              return (
                <div key={mood.value} style={{
                  background: mood.bg,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', color: mood.color }}>
                    {mood.icon}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginTop: '0.25rem'
                  }}>{mood.label}</div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Mood Form */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>Bagaimana perasaanmu hari ini?</h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Date Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>Tanggal</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
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
              }}>Pilih mood kamu</label>
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
                      border: `2px solid ${selectedMood === mood.value ? '#9ca3af' : '#e5e7eb'}`,
                      background: selectedMood === mood.value ? mood.bg : '#f9fafb',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
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
                Tambahkan catatan (opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Apa yang ada di pikiranmu? Ada alasan khusus untuk mood ini?"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  minHeight: '100px',
                  resize: 'vertical'
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
                  : '#d1d5db',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: selectedMood ? 1 : 0.7
              }}
            >
              Simpan Mood
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>Riwayat Mood</h3>
          
          {moods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 0',
              color: '#6b7280'
            }}>
              <Smile size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
              <p>Belum ada entri mood. Mulai lacak emosimu!</p>
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
                    background: '#f9fafb',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}>
                    <div style={{
                      background: moodData.bg,
                      padding: '0.5rem',
                      borderRadius: '8px',
                      color: moodData.color
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
                        <ChevronRight size={16} color="#9ca3af" />
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>{mood.date}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af'
                        }}>{mood.timestamp}</span>
                      </div>
                      {mood.note && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#4b5563',
                          margin: 0
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
                        alignItems: 'center'
                      }}
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
                  <p>Menampilkan 10 entri terbaru dari {moods.length} total</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
