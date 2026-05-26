export function BrandLockup({ caption }: { caption: string }) {
  return (
    <span className="brand-lockup">
      <span className="brand-mark">PS</span>
      <span className="brand-text">
        <span className="brand-name">Phantom Shield</span>
        <span className="brand-caption">{caption}</span>
      </span>
    </span>
  );
}
