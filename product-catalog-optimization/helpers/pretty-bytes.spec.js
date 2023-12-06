const { prettyBytes } = require('./pretty-bytes');

describe('pretty-bytes', () => {
  // Test des cas de base
  it('renders 0 bytes to 0B', () => {
    expect(prettyBytes(0)).toBe('0B');
  });

  it('renders 1 byte to 1B', () => {
    expect(prettyBytes(1)).toBe('1B');
  });

  it('renders 42 bytes to 42B', () => {
    expect(prettyBytes(42)).toBe('42B');
  });

  // Test des conversions en kilo-octets (KB)
  it('renders 1024 bytes to 1KB', () => {
    expect(prettyBytes(1024)).toBe('1KB');
  });

  it('renders 2048 bytes to 2KB', () => {
    expect(prettyBytes(2048)).toBe('2KB');
  });

  it('renders 3000 bytes to 2.93KB', () => {
    expect(prettyBytes(3000)).toBe('2.93KB');
  });

  // Test des conversions en mégaoctets (MB)
  it('renders 1048576 bytes to 1MB', () => {
    expect(prettyBytes(1048576)).toBe('1MB');
  });

  // Test des conversions en gigaoctets (GB)
  it('renders 1073741824 bytes to 1GB', () => {
    expect(prettyBytes(1073741824)).toBe('1GB');
  });

  // Test des conversions en téraoctets (TB)
  it('renders 2199023256000 bytes to 2TB', () => {
    expect(prettyBytes(2199023256000)).toBe('2TB');
  });

  // Test des conversions en pétaoctets (PB)
  it('renders 2251799814000000 bytes to 2PB', () => {
    expect(prettyBytes(2251799814000000)).toBe('2PB');
  });
});
