import type { BrandItem } from './types';

export const NAV_LINKS = ['About', ] as const;

// "As featured in" style press marquee - real outlets, purely as a "where geopolitics is
// discussed" cultural reference, not a claim of partnership.
export const HERO_BRANDS: BrandItem[] = [
  {
    name: 'Reuters',
    style: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '15px' },
  },
  {
    name: 'Bloomberg',
    style: {
      fontFamily: 'Arial, sans-serif',
      fontWeight: 900,
      letterSpacing: '0.08em',
      fontSize: '13px',
      textTransform: 'uppercase',
    },
  },
  {
    name: 'The Economist',
    style: {
      fontFamily: '"Trebuchet MS", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: '15px',
      fontStyle: 'italic',
    },
  },
  {
    name: 'Foreign Policy',
    style: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
      letterSpacing: '0.12em',
      fontSize: '13px',
      textTransform: 'uppercase',
    },
  },
  {
    name: 'Al Jazeera',
    style: {
      fontFamily: 'Palatino, "Book Antiqua", serif',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      fontSize: '16px',
    },
  },
  {
    name: 'BBC News',
    style: { fontFamily: 'Impact, "Arial Narrow", sans-serif', fontWeight: 400, letterSpacing: '0.04em', fontSize: '14px' },
  },
  {
    name: 'AP News',
    style: { fontFamily: 'Verdana, sans-serif', fontWeight: 700, letterSpacing: '-0.03em', fontSize: '13px' },
  },
];

// Fictional backer names (typographic decoration only) - deliberately not real think tanks or
// funds, so the marquee never reads as a claim that a specific real institution funds this site.
export const BACKER_BRANDS: BrandItem[] = [
  {
    name: 'Regions',
    style: { fontFamily: '"Times New Roman", serif', fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' },
  },
  {
    name: 'Conflicts & Security',
    style: { fontFamily: '"Arial Black", sans-serif', fontWeight: 900, letterSpacing: '0.08em', fontSize: '16px' },
  },
  {
    name: 'International Relations',
    style: { fontFamily: 'Impact, sans-serif', fontWeight: 700, letterSpacing: '0.05em', fontSize: '18px' },
  },
  {
    name: 'Economics & Trade',
    style: { fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '17px' },
  },
  {
    name: 'Energy & Resources',
    style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.01em', fontSize: '15px' },
  },
  {
    name: 'Technology & Cyber',
    style: {
      fontFamily: 'Verdana, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.06em',
      fontSize: '14px',
      textTransform: 'uppercase',
    },
  },
  {
    name: 'Politics & Governance',
    style: { fontFamily: '"Courier New", monospace', fontWeight: 700, letterSpacing: '0.18em', fontSize: '14px' },
  },
  {
    name: 'Maritime & Strategic Routes',
    style: { fontFamily: 'Palatino, serif', fontWeight: 500, letterSpacing: '0.03em', fontSize: '15px' },
  },
];

export const HERO_VIDEO_URL =
  'https://res.cloudinary.com/nzfozybo/video/upload/v1783617825/7431751-uhd_4096_2160_30fps_mkxans.mp4';

export const USE_CASES_VIDEO_URL =
  'https://res.cloudinary.com/nzfozybo/video/upload/v1783619960/uhd_25fps_umki0p.mp4';

export const CARD_BG_IMAGE_URL =
  'https://res.cloudinary.com/nzfozybo/image/upload/v1783612267/misi%C3%B3n_empresarial_declaraci%C3%B3n_de_misi%C3%B3n_objetivos_y_filosof%C3%ADa_empresarial_visi%C3%B3n_de_la_empresa_valores_fundamentales_compromiso_del_cliente_lealtad_y_satisfacci%C3%B3n_dise%C3%B1o_plano_ilustraci%C3%B3n_moderna_cs1cu7.jpg';
