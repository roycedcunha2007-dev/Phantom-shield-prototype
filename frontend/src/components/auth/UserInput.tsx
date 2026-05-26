import { Input } from "@/components/common/Input";

export function UserInput({ id, label, placeholder, autoComplete = "off", value, onChange }: { id: string; label: string; placeholder: string; autoComplete?: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Input id={id} autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
