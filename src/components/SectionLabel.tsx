export default function SectionLabel({ index, label, className = '' }: { index: string; label: string; className?: string }) {
  return (
    <div className={`reveal-label mono flex items-center gap-4 text-fog ${className}`}>
      <span className="text-ember">{index}</span>
      <span className="h-px w-12 bg-white/20" />
      <span>{label}</span>
    </div>
  )
}
