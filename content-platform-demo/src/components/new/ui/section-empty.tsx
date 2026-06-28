interface SectionEmptyProps {
  message: string
}

export function SectionEmpty({ message }: SectionEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-hairline px-4 py-8 text-center">
      <p className="text-[12px] text-fog-gray">{message}</p>
    </div>
  )
}
