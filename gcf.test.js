const gcf = require('./gcf');

test('gcf function should exist', () => {
    expect(gcf).toBeDefined();
});

test('gcf of 12 and 18 should be 6', () => {
    expect(gcf(12, 18)).toBe(6);
});

test('gcf of 48 and 32 should be 16', () => {
    expect(gcf(48, 32)).toEqual(16);
});