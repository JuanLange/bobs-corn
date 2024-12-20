// Configuración global para los tests
jest.setTimeout(10000); // 10 segundos de timeout

// Mock para IntersectionObserver que requiere Framer Motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock para ResizeObserver que requiere Recharts
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};
