"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Smile, Frown, Meh, Heart, Star, Sun, Cloud, CloudRain, Zap } from 'lucide-react';

type Mood = {
  id: number;
  mood: string;
  note: string;
  date: string;
  timestamp: string;
};


const MoodTracker = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const moodOptions = [
    { value: 'amazing', label: 'Amazing', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500', bg: 'bg-green-100' },
    { value: 'good', label: 'Good', icon: Sun, color: 'text-blue-500', bg: 'bg-blue-100' },
    { value: 'okay', label: 'Okay', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100' },
    { value: 'sad', label: 'Sad', icon: Cloud, color: 'text-purple-500', bg: 'bg-purple-100' },
    { value: 'angry', label: 'Angry', icon: Zap, color: 'text-red-500', bg: 'bg-red-100' },
    { value: 'anxious', label: 'Anxious', icon: CloudRain, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  ];

  useEffect(() => {
    // Load moods from localStorage (since we can't use backend storage)
    const savedMoods = JSON.parse(localStorage.getItem('moods') || '[]');
    setMoods(savedMoods);
  }, []);

  const saveMood = () => {
    if (!selectedMood) return;

    const newMood = {
      id: Date.now(),
      mood: selectedMood,
      note: note,
      date: currentDate,
      timestamp: new Date().toLocaleString()
    };

    const updatedMoods = [newMood, ...moods];
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
    
    // Reset form
    setSelectedMood('');
    setNote('');
  };

  const deleteMood = (id) => {
    const updatedMoods = moods.filter(mood => mood.id !== id);
    setMoods(updatedMoods);
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
  };

  const getMoodIcon = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood : moodOptions[3]; // default to 'okay'
  };

  const getMoodStats = () => {
    const last7Days = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });

    const moodCounts = {};
    last7Days.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    return { total: last7Days.length, counts: moodCounts };
  };

  const stats = getMoodStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Heart className="text-pink-500" size={40} />
            My Mood Tracker
          </h1>
          <p className="text-gray-600">Track your daily emotions and build better mental health habits</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} />
            Weekly Summary ({stats.total} entries)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moodOptions.slice(0, 4).map(mood => {
              const count = stats.counts[mood.value] || 0;
              const IconComponent = mood.icon;
              return (
                <div key={mood.value} className={`${mood.bg} rounded-lg p-3 text-center`}>
                  <IconComponent className={`${mood.color} mx-auto mb-1`} size={24} />
                  <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                  <div className="text-lg font-bold text-gray-800">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Mood Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">How are you feeling today?</h3>
          
          <div className="space-y-6">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select your mood</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {moodOptions.map(mood => {
                  const IconComponent = mood.icon;
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedMood === mood.value
                          ? `${mood.bg} border-gray-400 shadow-md`
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className={`${mood.color} mx-auto mb-2`} size={28} />
                      <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Any specific reason for this mood?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={saveMood}
              disabled={!selectedMood}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-pink-500"
            >
              Save Mood Entry
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Mood History</h3>
          
          {moods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Smile className="mx-auto mb-4 text-gray-300" size={48} />
              <p>No mood entries yet. Start tracking your emotions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moods.slice(0, 10).map(mood => {
                const moodData = getMoodIcon(mood.mood);
                const IconComponent = moodData.icon;
                return (
                  <div key={mood.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`${moodData.bg} p-2 rounded-lg`}>
                      <IconComponent className={moodData.color} size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-800 capitalize">{mood.mood}</span>
                        <span className="text-sm text-gray-500">{mood.date}</span>
                        <span className="text-xs text-gray-400">{mood.timestamp}</span>
                      </div>
                      {mood.note && (
                        <p className="text-gray-600 text-sm">{mood.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMood(mood.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              
              {moods.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-gray-500 text-sm">Showing latest 10 entries of {moods.length} total</p>
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
