import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { OnboardingStep } from '@/components/onboarding-step';
import { OptionChipGroup } from '@/components/option-chip-group';
import { useAuth } from '@/contexts/auth-context';
import { listHealthConditions, submitConditions, type HealthCondition } from '@/services/clinical-profile';

const TOTAL_STEPS = 4;

export default function OnboardingConditionsScreen() {
  const { token } = useAuth();
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    listHealthConditions(token)
      .then((response) => setConditions(response.data))
      .catch(() => {
        /* lista fica vazia — usuário ainda pode pular a etapa */
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  function toggle(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    );
  }

  async function handleContinue() {
    if (!token || selectedIds.length === 0) {
      router.replace('/onboarding-blood-type');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitConditions(token, selectedIds);
    } catch {
      /* falha ao salvar não deve travar o cadastro — usuário revisa depois no perfil */
    } finally {
      setIsSubmitting(false);
      router.replace('/onboarding-blood-type');
    }
  }

  return (
    <OnboardingStep
      stepIndex={1}
      totalSteps={TOTAL_STEPS}
      title="Alguma lesão ou condição?"
      subtitle="Selecione lesões antigas ou condições crônicas que fazem parte do seu histórico."
      onSkip={() => router.replace('/onboarding-blood-type')}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}>
      {isLoading ? (
        <ActivityIndicator color="#0A84FF" />
      ) : (
        <OptionChipGroup
          options={conditions.map((condition) => ({ id: condition.id, label: condition.name }))}
          selectedIds={selectedIds}
          onToggle={toggle}
          pickerTitle="Alguma lesão ou condição?"
        />
      )}
    </OnboardingStep>
  );
}
