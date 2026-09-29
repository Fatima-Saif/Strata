import { formatCurrency, formatPercentageChange } from './utils';
import { describe, it, expect } from 'vitest';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
    
    it('handles custom locale and currency if needed', () => {
      // Test is using default en-US USD, but if extended we'd test it here
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });
  });

  describe('formatPercentageChange', () => {
    it('formats positive percentage correctly', () => {
      expect(formatPercentageChange(15.4)).toBe('+15.4%');
    });

    it('formats negative percentage correctly', () => {
      expect(formatPercentageChange(-5.2)).toBe('-5.2%');
    });

    it('formats zero percentage correctly', () => {
      expect(formatPercentageChange(0)).toBe('0.0%');
    });
  });
});
