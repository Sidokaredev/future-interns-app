export default function SimpleEmphasis({
  text,
  textColor = "#06816d"
}: {
  text: string | number
  textColor?: string
}) {
  return (
    <span
      style={{
        color: textColor,
        fontWeight: 600
      }}
    >
      {text}
    </span>
  )
}