import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface CheckboxGroupProps {
  values: string[];
  onChange: (value: string, checked: boolean) => void;
  options: string[];
}

export function CheckboxGroup({ values, onChange, options }: CheckboxGroupProps) {
  return (
    <div className="grid gap-4">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={values.includes(option)}
            onCheckedChange={(checked) => onChange(option, checked as boolean)}
          />
          <Label htmlFor={option}>{option}</Label>
        </div>
      ))}
    </div>
  );
} 