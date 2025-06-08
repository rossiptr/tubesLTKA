"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar, Smile, Frown, Meh, Heart, Star,
  Sun, Cloud, CloudRain, Zap
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

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
  icon: React.ComponentType<LucideProps>;
  color: string;
  bg: string;
};

const MoodTracker = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const moodOptions: MoodOption[] = [
    { value: 'amazing', label: 'Amazing', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500', bg: 'bg-green-100' },
    { value: 'good', label: 'Good', icon: Sun, color: 'text-blue-500', bg: 'bg-blue-100' },
    { value: 'okay', label: 'Okay', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100' },
    { value: 'sad', label: 'Sad', icon: Cloud, color: 'text-purple-500', bg: 'bg-purple-100' },
    { value: 'angry', label: 'Angry', icon: Zap, color: 'text-red-500', bg: 'bg-red-100' },
    { value: 'anxious', label: 'Anxious', icon: CloudRain, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  ];

  useEffect(() => {
    const savedMoods = JSON.parse(localStorage.getItem('moods') || '[]');
    setMoods(savedMoods);
  }, []);

  const saveMood = () => {
    if (!selectedMood) return;

    const newMood: Mood = {
      id: Date.now(),
      mood: selectedMood,
      note: note,
      date: currentDate,
      timestamp: new Date().toLocaleString(),
    };

    const updatedMoods = [newMood, ...moods];
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));

    setSelectedMood('');
    setNote('');
  };

  const deleteMood = (id: number) => {
    const updatedMoods = moods.filter((mood) => mood.id !== id);
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
  };

  const getMoodIcon = (moodValue: string): MoodOption => {
    const mood = moodOptions.find((m) => m.value === moodValue);
    return mood || moodOptions[3]; // default to 'okay'
  };

  const getMoodStats = () => {
    const last7Days = moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });

    const moodCounts: { [key: string]: number } = {};
    last7Days.forEach((mood) => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    return { total: last7Days.length, counts: moodCounts };
  };

  const stats = getMoodStats();

return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            ❤️ My Mood Tracker
          </h1>
          <p style={styles.subtitle}>Track your daily emotions and build better mental health habits</p>
        </div>

        {/* Stats Card */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
            📅 Weekly Summary ({stats.total} entries)
          </h3>
          <div style={styles.statsGrid}>
            {moodOptions.slice(0, 4).map(mood => {
              const count = stats.counts[mood.value] || 0;
              return (
                <div key={mood.value} style={styles.statItem}>
                  <div style={styles.statEmoji}>{mood.emoji}</div>
                  <div style={styles.statLabel}>{mood.label}</div>
                  <div style={styles.statValue}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Mood Form */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '25px', color: '#333' }}>
            How are you feeling today?
          </h3>
          
          <div>
            {/* Date Input */}
            <div style={styles.formSection}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Mood Selection */}
            <div style={styles.formSection}>
              <label style={styles.label}>Select your mood</label>
              <div style={styles.moodGrid}>
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    style={{
                      ...styles.moodButton,
                      ...(selectedMood === mood.value ? styles.moodButtonSelected : {})
                    }}
                  >
                    <div style={styles.moodEmoji}>{mood.emoji}</div>
                    <div style={styles.moodLabel}>{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div style={styles.formSection}>
              <label style={styles.label}>Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Any specific reason for this mood?"
                style={styles.textarea}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={saveMood}
              disabled={!selectedMood}
              style={{
                ...styles.saveButton,
                ...(selectedMood ? {} : styles.saveButtonDisabled)
              }}
            >
              Save Mood Entry
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
            Mood History
          </h3>
          
          {moods.length === 0 ? (
            <div style={styles.historyEmpty}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>😊</div>
              <p>No mood entries yet. Start tracking your emotions!</p>
            </div>
          ) : (
            <div>
              {moods.slice(0, 10).map(mood => {
                const moodData = getMoodData(mood.mood);
                return (
                  <div key={mood.id} style={styles.historyItem}>
                    <div style={styles.historyEmoji}>{moodData.emoji}</div>
                    <div style={styles.historyContent}>
                      <div style={styles.historyHeader}>
                        <span style={styles.historyMood}>{mood.mood}</span>
                        <span style={styles.historyDate}>{mood.date}</span>
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{mood.timestamp}</span>
                      </div>
                      {mood.note && (
                        <p style={styles.historyNote}>{mood.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMood(mood.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              
              {moods.length > 10 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Showing latest 10 entries of {moods.length} total
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
