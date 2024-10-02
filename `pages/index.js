import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CoffeeOClock() {
  const [mode, setMode] = useState('regular');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [caffeineAmount, setCaffeineAmount] = useState(90);
  const [bedtime, setBedtime] = useState('12AM');
  const [remainingCaffeine, setRemainingCaffeine] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    calculateRemainingCaffeine();
  }, [caffeineAmount, bedtime, currentTime]);

  const calculateRemainingCaffeine = () => {
    const now = currentTime;
    const bedtimeDate = new Date(now);
    const [bedtimeHour, bedtimeAMPM] = bedtime.match(/(\d+)([AP]M)/).slice(1);
    bedtimeDate.setHours(
      bedtimeAMPM === 'PM' ? parseInt(bedtimeHour) + 12 : parseInt(bedtimeHour),
      0,
      0,
      0
    );
    if (bedtimeDate <= now) {
      bedtimeDate.setDate(bedtimeDate.getDate() + 1);
    }
    const hoursUntilBedtime = (bedtimeDate - now) / (1000 * 60 * 60);
    const remaining = caffeineAmount * Math.pow(0.5, hoursUntilBedtime / 6);
    setRemainingCaffeine(remaining);
  };

  const handleModeChange = () => {
    setMode(mode === 'regular' ? 'custom' : 'regular');
  };

  const handleCaffeineAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaffeineAmount(parseInt(e.target.value));
  };

  const handleBedtimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBedtime(e.target.value);
  };

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Coffee O'Clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Coffee O'Clock</h1>
        <div className="text-2xl font-bold mb-4 text-center">
          {currentTime.toLocaleTimeString()}
        </div>

        <div className="mb-4">
          <button
            onClick={handleModeChange}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Switch to {mode === 'regular' ? 'Custom' : 'Regular'} Mode
          </button>
        </div>

        {mode === 'regular' ? (
          <div>
            <p className="mb-2">
              Assuming you're drinking a cup of coffee (8oz/236 mL) containing 90mg of caffeine right now:
            </p>
            <p className="font-bold">
              You would have {remainingCaffeine.toFixed(1)}mg of caffeine in your blood if you went to bed at 12AM.
            </p>
            <p>
              It's as if you had drunk {((remainingCaffeine / 90) * 100).toFixed(0)}% of a cup of coffee before you went to bed.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block mb-2">Caffeine amount (mg):</label>
              <input
                type="number"
                value={caffeineAmount}
                onChange={handleCaffeineAmountChange}
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Bedtime:</label>
              <select
                value={bedtime}
                onChange={handleBedtimeChange}
                className="w-full border rounded py-2 px-3"
              >
                {[...Array(24)].map((_, i) => {
                  const hour = i % 12 || 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  return (
                    <option key={i} value={`${hour}${ampm}`}>
                      {`${hour}:00 ${ampm}`}
                    </option>
                  );
                })}
              </select>
            </div>
            <p className="font-bold">
              You would have {remainingCaffeine.toFixed(1)}mg of caffeine in your blood if you went to bed at {bedtime}.
            </p>
            <p>
              It's as if you had drunk {((remainingCaffeine / 90) * 100).toFixed(0)}% of a cup of coffee before you went to bed.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Created by Eliya-G</p>
        <p>
          <a href="https://github.com/Eliya-G/coffee-o-clock" className="text-blue-500 hover:underline">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
