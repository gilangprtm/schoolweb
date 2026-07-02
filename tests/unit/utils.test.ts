import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatMonthYear,
  formatLevel,
  formatChampion,
  getChampionEmoji,
  getLevelBadgeColor,
  getFacilityIcon,
  getFacilityCategoryLabel,
  slugify,
  truncate,
} from '@/lib/utils';

describe('cn (className merge)', () => {
  it('should merge classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle tailwind conflicts', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('should filter falsy values', () => {
    expect(cn('base', false && 'hidden', undefined, 'extra')).toBe('base extra');
  });
});

describe('formatDate', () => {
  it('should format to Indonesian locale', () => {
    const result = formatDate('2025-06-20');
    expect(result).toBe('20 Juni 2025');
  });

  it('should accept Date object', () => {
    const result = formatDate(new Date('2025-01-01'));
    expect(result).toBe('1 Januari 2025');
  });
});

describe('formatMonthYear', () => {
  it('should format to Month Year', () => {
    expect(formatMonthYear('2025-06-15')).toBe('Juni 2025');
  });
});

describe('formatLevel', () => {
  it('should format all levels correctly', () => {
    expect(formatLevel('kecamatan')).toBe('Kecamatan');
    expect(formatLevel('kabupaten')).toBe('Kabupaten/Kota');
    expect(formatLevel('provinsi')).toBe('Provinsi');
    expect(formatLevel('nasional')).toBe('Nasional');
    expect(formatLevel('internasional')).toBe('Internasional');
  });
});

describe('formatChampion', () => {
  it('should format champions', () => {
    expect(formatChampion('1')).toBe('Juara 1');
    expect(formatChampion('2')).toBe('Juara 2');
    expect(formatChampion('3')).toBe('Juara 3');
    expect(formatChampion('harapan')).toBe('Harapan');
    expect(formatChampion('peserta')).toBe('Peserta');
  });
});

describe('getChampionEmoji', () => {
  it('should return correct emoji', () => {
    expect(getChampionEmoji('1')).toBe('🥇');
    expect(getChampionEmoji('2')).toBe('🥈');
    expect(getChampionEmoji('3')).toBe('🥉');
    expect(getChampionEmoji('harapan')).toBe('🏅');
    expect(getChampionEmoji('peserta')).toBe('🎖️');
  });
});

describe('getLevelBadgeColor', () => {
  it('should return Tailwind classes', () => {
    expect(getLevelBadgeColor('internasional')).toContain('bg-amber');
    expect(getLevelBadgeColor('nasional')).toContain('bg-red');
    expect(getLevelBadgeColor('kecamatan')).toContain('bg-neutral');
  });
});

describe('getFacilityIcon', () => {
  it('should return icon for each category', () => {
    expect(getFacilityIcon('akademik')).toBe('📚');
    expect(getFacilityIcon('olahraga')).toBe('⚽');
    expect(getFacilityIcon('teknologi')).toBe('💻');
  });
});

describe('getFacilityCategoryLabel', () => {
  it('should return labels', () => {
    expect(getFacilityCategoryLabel('akademik')).toBe('Akademik');
    expect(getFacilityCategoryLabel('lainnya')).toBe('Lainnya');
  });
});

describe('slugify', () => {
  it('should generate slug from title', () => {
    expect(slugify('Drs. Ahmad Fauzi, M.Pd.')).toBe('drs-ahmad-fauzi-mpd');
  });

  it('should handle simple text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should collapse multiple hyphens', () => {
    expect(slugify('a---b')).toBe('a-b');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('should remove special characters', () => {
    expect(slugify('foo@bar#baz!')).toBe('foobarbaz');
  });
});

describe('truncate', () => {
  it('should not truncate short text', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should truncate long text', () => {
    expect(truncate('Hello World Foo Bar', 8)).toBe('Hello Wo...');
  });
});
