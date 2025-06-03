'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export default function Home() {
  const [moods, setMoods] = useState<Schema["Todo"]["type"][]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');

  const fetchMoods = async () => {
    const { data } = await client.models.Todo.list();
    setMoods(data);
  };

  const addMood = async () => {
    if (!selectedMood) return;

    await client.models.Todo.create({
      name: `${selectedMood} ${note ? `- ${note}` : ''}`,
    });

    setSelectedMood('');
    setNote('');
    fetchMoods();
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const moodOptions = [
    '😊 Happy',
    '😢 Sad',
    '😡 Angry',
    '😴 Tired',
    '🤩 Excited',
    '😌 Calm',
    '🥺 Anxious',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-100 flex flex-col items-center justify-start py-10">
      <h1 className="text-4xl font-bold text-black mb-6">My Mood Tracker</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <select
          className="w-full p-2 mb-3 border rounded"
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
        >
          <option value="">🌈 Choose your mood</option>
          {moodOptions.map((mood, index) => (
            <option key={index} value={mood}>{mood}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Optional note..."
          className="w-full p-2 mb-3 border rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={addMood}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          + Add Mood
        </button>
      </div>

      <ul className="mt-6 w-full max-w-md">
        {moods.map((mood, index) => (
          <li
            key={mood.id ?? index}
            className="bg-white border p-3 my-2 rounded shadow"
          >
            {mood.name}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-purple-800">🌸 Track your mood daily to reflect better!</p>
    </main>
  );
}
