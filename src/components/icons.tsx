import { LucideProps } from 'lucide-react';
import { Logo, LogoProps } from './logo';

const IconWrapper = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const Icons = {
  logo: ({ iconOnly, ...props }: LogoProps) => (
    <Logo iconOnly={iconOnly} {...props} />
  ),
  spinner: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </IconWrapper>
  ),
  google: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M21.8 10.5H12v4h5.6c-.7 3-3 4.5-5.6 4.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.6 0 2.8.6 3.8 1.6l2.9-2.9C16.8 2.2 14.5 1 12 1 6.5 1 2 5.5 2 11s4.5 10 10 10 10-4.5 10-10c0-.7-.1-1.4-.2-2z" />
    </IconWrapper>
  ),
  dashboard: (props: LucideProps) => (
    <IconWrapper {...props}>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </IconWrapper>
  ),
  logout: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconWrapper>
  ),
  user: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconWrapper>
  ),
  settings: (props: LucideProps) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.4.7.4 1.5 0 2.2v.3c.22.8.12 1.6-.2 2.3z" />
    </IconWrapper>
  ),
  upload: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </IconWrapper>
  ),
  file: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </IconWrapper>
  ),
  check: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polyline points="20 6 9 17 4 12" />
    </IconWrapper>
  ),
  x: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconWrapper>
  ),
  chevronDown: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polyline points="6 9 12 15 18 9" />
    </IconWrapper>
  ),
  chevronRight: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polyline points="9 18 15 12 9 6" />
    </IconWrapper>
  ),
  plus: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </IconWrapper>
  ),
  search: (props: LucideProps) => (
    <IconWrapper {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconWrapper>
  ),
  filter: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </IconWrapper>
  ),
  calendar: (props: LucideProps) => (
    <IconWrapper {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </IconWrapper>
  ),
  barChart: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </IconWrapper>
  ),
  lineChart: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </IconWrapper>
  ),
  gauge: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </IconWrapper>
  ),
  trendingUp: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </IconWrapper>
  ),
  trendingDown: (props: LucideProps) => (
    <IconWrapper {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </IconWrapper>
  ),
  trendingFlat: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="22" y1="12" x2="2" y2="12" />
      <polyline points="16 6 22 12 16 18" />
    </IconWrapper>
  ),
  package: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </IconWrapper>
  ),
  network: (props: LucideProps) => (
    <IconWrapper {...props}>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </IconWrapper>
  ),
  info: (props: LucideProps) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </IconWrapper>
  ),
  alertTriangle: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </IconWrapper>
  ),
  download: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </IconWrapper>
  ),
  externalLink: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </IconWrapper>
  ),
  menu: (props: LucideProps) => (
    <IconWrapper {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </IconWrapper>
  ),
  xCircle: (props: LucideProps) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </IconWrapper>
  ),
  checkCircle: (props: LucideProps) => (
    <IconWrapper {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </IconWrapper>
  ),
  alertCircle: (props: LucideProps) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconWrapper>
  )
};
