import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { OnboardingStep } from '@/components/onboarding-step';
import { OptionChipGroup } from '@/components/option-chip-group';
import { useAuth } from '@/contexts/auth-context';
import { listMedications, submitMedicationAllergies, type Medication } from '@/services/clinical-profile';

const TOTAL_STEPS = 4;

export default function OnboardingAllergiesScreen() {
  const { token } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    listMedications(token)
      .then((response) => setMedications(response.data))
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
      router.replace('/onboarding-conditions');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitMedicationAllergies(token, selectedIds);
    } catch {
      /* falha ao salvar não deve travar o cadastro — usuário revisa depois no perfil */
    } finally {
      setIsSubmitting(false);
      router.replace('/onboarding-conditions');
    }
  }

  return (
    <OnboardingStep
      stepIndex={0}
      totalSteps={TOTAL_STEPS}
      title="Alergia a algum medicamento?"
      subtitle="Selecione os que você sabe que têm reação. Isso ajuda em atendimentos de emergência."
      onSkip={() => router.replace('/onboarding-conditions')}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}>
      {isLoading ? (
        <ActivityIndicator color="#0A84FF" />
      ) : (
        <OptionChipGroup
          options={medications.map((medication) => ({ id: medication.id, label: medication.name }))}
          selectedIds={selectedIds}
          onToggle={toggle}
          pickerTitle="Alergia a algum medicamento?"
        />
      )}
    </OnboardingStep>
  );
}
