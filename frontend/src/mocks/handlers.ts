import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Intercept GET /api/v1/dashboard/stats
  http.get('http://localhost:8080/api/v1/dashboard/stats', async () => {
    // Simulate realistic network delay
    await delay(500);

    return HttpResponse.json([
      { label: 'Active Activities (Mocked)', value: '18', trend: '+15%', color: 'from-blue-500/20 to-indigo-500/20' },
      { label: 'Total Registrations', value: '2,845', trend: '+22%', color: 'from-purple-500/20 to-pink-500/20' },
      { label: 'Avg. Success Rate', value: '98.5%', trend: '-0.4%', color: 'from-emerald-500/20 to-teal-500/20' },
    ]);
  }),

  // Intercept GET /api/v1/activities/recent
  http.get('http://localhost:8080/api/v1/activities/recent', async () => {
    // Simulate a scenario: 20% chance of "Queueing" delay
    const isQueueing = Math.random() < 0.2;
    if (isQueueing) {
      await delay(2000); // 2 second mock delay
      return new HttpResponse(
        JSON.stringify({ error: 'Queueing... Please wait' }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await delay(300);

    return HttpResponse.json([
      {
        id: 1,
        title: 'Global Tech Summit 2026 (Mock)',
        description: 'Coming soon in Tokyo • 12,000 slots',
        date: 'Apr 15',
        status: 'Registration Open',
      },
      {
        id: 2,
        title: 'Cloud Native Conference Shanghai',
        description: 'Shanghai World Expo • 8,000 slots',
        date: 'May 04',
        status: 'Warm Up',
      },
      {
        id: 3,
        title: 'Esports World Championship Final',
        description: 'Beijing National Stadium • 50,000 slots',
        date: 'Jun 12',
        status: 'Sold Out',
      },
    ]);
  }),
];
