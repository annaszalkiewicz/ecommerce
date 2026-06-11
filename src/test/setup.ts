import { afterEach, beforeEach, vi } from 'vitest';

// NOTE: stores must NOT be imported here. Each test file registers its own
// `vi.mock` for the data helpers, and that mock is only applied to modules
// imported *after* it. Importing the stores in this shared setup would
// evaluate them with the real helpers and defeat the mocks.

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
});
