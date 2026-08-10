/** Professional Give Away brand mark — hands + heart icon with optional pill wrapper */

export function BrandLogoIcon({ className = 'h-7 w-7' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Heart outline */}
      <path
        d="M16 25.5C16 25.5 7.5 19.5 7.5 13.5C7.5 10.2 10.1 7.5 13.2 7.5C14.9 7.5 16.4 8.3 17.3 9.6C18.2 8.3 19.7 7.5 21.4 7.5C24.5 7.5 27.1 10.2 27.1 13.5C27.1 19.5 18.6 25.5 16 25.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cupped hands */}
      <path
        d="M8.5 27.5C8.5 27.5 10.5 23.5 13 21.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M23.5 27.5C23.5 27.5 21.5 23.5 19 21.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Accent dot inside heart */}
      <circle cx="19.25" cy="15.75" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function BrandLogo({ onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'giveaway-brand-btn giveaway-nav-btn inline-flex shrink-0 items-center gap-2.5 rounded-sm bg-transparent px-0 py-0',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
        className,
      ].join(' ')}
      aria-label={onClick ? 'Give Away home' : undefined}
    >
      <span className="text-black">
        <BrandLogoIcon className="h-7 w-7" />
      </span>
      <span className="text-[15px] font-bold uppercase leading-none tracking-[0.08em] text-black sm:text-base">
        Give Away
      </span>
    </Tag>
  );
}
