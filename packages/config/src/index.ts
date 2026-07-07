import type { Config } from 'tailwindcss';

export const tailwindBaseConfig: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          placeholder: 'var(--text-placeholder)',
          inverse: 'var(--text-inverse)',
        },
        brand: {
          primary: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
        },
        semantic: {
          success: 'var(--success)',
          'success-bg': 'var(--success-bg)',
          warning: 'var(--warning)',
          'warning-bg': 'var(--warning-bg)',
          danger: 'var(--danger)',
          'danger-bg': 'var(--danger-bg)',
          info: 'var(--info)',
          'info-bg': 'var(--info-bg)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
          brand: 'var(--border-brand)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        raised: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        floating: '0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
        modal: '0 20px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)',
      },
    },
  },
};
export default tailwindBaseConfig;
