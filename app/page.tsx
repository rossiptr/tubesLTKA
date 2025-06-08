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
  { value: 'amazing', label: 'Amazing', icon: <Star size={14} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { value: 'happy', label: 'Happy', icon: <Smile size={14} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'good', label: 'Good', icon: <Sun size={14} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'okay', label: 'Okay', icon: <Meh size={14} />, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  { value: 'sad', label: 'Sad', icon: <CloudRain size={14} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { value: 'angry', label: 'Angry', icon: <Zap size={14} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  { value: 'anxious', label: 'Anxious', icon: <Frown size={14} />, color: '#d946ef', bg: 'rgba(217, 70, 239, 0.1)' }
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

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      padding: '0.5rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '98%',
        maxWidth: '900px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        height: '95%'
      }}>
        {/* Left Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          height: '100%'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Heart color="#ec4899" size={20} fill="#ec4899" />
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Mood Tracker</h1>
            </div>
          </div>

          {/* Mood Selection */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  style={{
                    padding: '0.25rem',
                    borderRadius: '6px',
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
                    fontSize: '0.625rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>{mood.label}</div>
                </button>
              ))}
            </div>

            {/* Date Input */}
            <div style={{ marginBottom: '0.75rem' }}>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  background: 'rgba(255,255,255,0.7)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Note Input */}
            <div style={{ marginBottom: '0.75rem', height: '60px' }}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Short note..."
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  resize: 'none'
                }}
                rows={2}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={saveMood}
              disabled={!selectedMood}
              style={{
                width: '100%',
                background: !selectedMood ? '#e5e7eb' : 
                  `linear-gradient(90deg, ${moodOptions.find(m => m.value === selectedMood)?.color || '#ec4899'}, #ec4899)`,
                color: 'white',
                padding: '0.375rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.75rem',
                border: 'none',
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                opacity: selectedMood ? 1 : 0.7
              }}
            >
              Save
            </button>
          </div>
        </div>

        {/* Right Column - History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          padding: '0.5rem',
          height: '100%',
          overflowY: 'auto'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0',
            paddingBottom: '0.25rem',
            borderBottom: '1px solid #e5e7eb'
          }}>Recent Entries</h3>
          
          {moods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1rem 0',
              color: '#6b7280',
              fontSize: '0.75rem'
            }}>
              No entries yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {moods.slice(0, 6).map(mood => {
                const moodData = moodOptions.find(m => m.value === mood.mood) || moodOptions[3];
                return (
                  <div key={mood.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{
                      background: moodData.bg,
                      padding: '0.25rem',
                      borderRadius: '4px',
                      color: moodData.color,
                      display: 'flex'
                    }}>
                      {moodData.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {mood.mood}
                      </div>
                      {mood.note && (
                        <div style={{ 
                          color: '#4b5563',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '0.6875rem'
                        }}>
                          {mood.note}
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '0.625rem', 
                      color: '#9ca3af',
                      whiteSpace: 'nowrap'
                    }}>
                      {mood.date}
                    </div>
                    <button
                      onClick={() => deleteMood(mood.id)}
                      style={{
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.125rem',
                        display: 'flex'
                      }}
                    >
                      <Trash2 size={12} />
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
