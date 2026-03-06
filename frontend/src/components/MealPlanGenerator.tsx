import { useState } from 'react';
import type { MealPlanResult } from '../data/mockData';

type MealPlanGeneratorProps = {
  onGenerate: (condition: string) => Promise<MealPlanResult>;
};

export default function MealPlanGenerator({ onGenerate }: MealPlanGeneratorProps) {
  const [condition, setCondition] = useState('general');
  const [result, setResult] = useState<MealPlanResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const response = await onGenerate(condition);
    setResult(response);
  }

  return (
    <div className="panel">
      <h3>Generate Preventive Meal Plan</h3>
      <form onSubmit={submit} className="field-row">
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="general">General wellness</option>
          <option value="diabetes">Diabetes</option>
          <option value="hypertension">Hypertension</option>
        </select>
        <button type="submit" className="btn primary">Generate</button>
      </form>

      {result && (
        <div className="meal-result">
          <h4>{result.condition} Plan</h4>
          <ul>
            {result.meals.map((meal) => <li key={meal}>{meal}</li>)}
          </ul>
          <p><strong>Hydration:</strong> {result.hydration}</p>
          <p><strong>Notes:</strong> {result.notes}</p>
        </div>
      )}
    </div>
  );
}
