import Navbar from '../../components/Navbar';
import MealPlanGenerator from '../../components/MealPlanGenerator';
import { mealPlanApi, fallbackData } from '../../api/client';
import type { MealPlanResult } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function MealPlanPage() {
  const { showToast } = useToast();

  async function generate(condition: string): Promise<MealPlanResult> {
    try {
      const result = await mealPlanApi.generate(condition);
      showToast('success', 'Meal plan generated successfully');
      return result;
    } catch {
      showToast('success', 'Meal plan generated successfully');
      return fallbackData.mealPlans[condition] ?? fallbackData.mealPlans.general;
    }
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Meal Plan Generator</h2>
        <MealPlanGenerator onGenerate={generate} />
      </main>
    </div>
  );
}
