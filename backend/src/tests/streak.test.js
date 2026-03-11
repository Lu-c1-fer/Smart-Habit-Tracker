import { describe, it, expect } from '@jest/globals';

// copy the function here directly — unit tests test functions in isolation
const calculateStreak = (logs) => {
  if (logs.length === 0) return 0;

  const loggedDates = new Set(
    logs.map(log => new Date(log.log_date).toISOString().split('T')[0])
  );

  const dateStr = (date) => date.toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let current;
  if (loggedDates.has(dateStr(today))) {
    current = today;
  } else if (loggedDates.has(dateStr(yesterday))) {
    current = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    if (loggedDates.has(dateStr(current))) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// helper — generates a date N days ago as { log_date: 'YYYY-MM-DD' }
const daysAgo = (n) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return { log_date: date.toISOString().split('T')[0] };
};

describe('calculateStreak', () => {

  it('returns 0 when no logs exist', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 when only today is logged', () => {
    const logs = [daysAgo(0)];  // today
    expect(calculateStreak(logs)).toBe(1);
  });

  it('returns correct streak for consecutive days logged today', () => {
    const logs = [daysAgo(0), daysAgo(1), daysAgo(2)];  // today, yesterday, 2 days ago
    expect(calculateStreak(logs)).toBe(3);
  });

  it('stops counting at a gap', () => {
    const logs = [daysAgo(0), daysAgo(1), daysAgo(3)];  // gap on day 2
    expect(calculateStreak(logs)).toBe(2);
  });

  it('returns 0 when last log was 2+ days ago', () => {
    const logs = [daysAgo(2), daysAgo(3), daysAgo(4)];  // nothing recent
    expect(calculateStreak(logs)).toBe(0);
  });

  it('grace period — returns streak if only yesterday logged, not today', () => {
    const logs = [daysAgo(1), daysAgo(2), daysAgo(3)];  // yesterday onwards
    expect(calculateStreak(logs)).toBe(3);
  });

  it('handles a long streak correctly', () => {
    // 30 consecutive days ending today
    const logs = Array.from({ length: 30 }, (_, i) => daysAgo(i));
    expect(calculateStreak(logs)).toBe(30);
  });

});