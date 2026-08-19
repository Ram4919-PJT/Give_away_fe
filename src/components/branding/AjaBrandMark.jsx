export const AJA_SYMBOL_SRC = '/assets/images/aja_logo.png';
export const AJA_FULL_LOGO_SRC = '/assets/images/GiveAway_Aja_Abayahastham_Logo.png';

const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 52,
  hero: 68,
};

export default function AjaBrandMark({ size = 'md', className = '' }) {
  const px = SIZE_MAP[size] || SIZE_MAP.md;
  const sizeClass = `aja-brand-mark aja-brand-mark--${size}`;

  return (
    <span className={`${sizeClass}${className ? ` ${className}` : ''}`} aria-hidden="true">
      <img
        src={AJA_SYMBOL_SRC}
        alt=""
        width={px}
        height={px}
        decoding="async"
      />
    </span>
  );
}
