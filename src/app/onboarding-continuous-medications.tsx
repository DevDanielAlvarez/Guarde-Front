import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OnboardingStep } from '@/components/onboarding-step';
import { OptionChipGroup } from '@/components/option-chip-group';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import {
  listMedications,
  submitContinuousMedications,
  type Medication,
} from '@/services/clinical-profile';

const TOTAL_STEPS = 4;

type MedicationDetails = { dosage: string; frequency: string };

export default function OnboardingContinuousMedicationsScreen() {
  const { token } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selected, setSelected] = useState<Record<string, MedicationDetails>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setSelected((current) => {
      if (id in current) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: { dosage: '', frequency: '' } };
    });
  }

  function updateDetails(id: string, details: Partial<MedicationDetails>) {
    setSelected((current) => ({ ...current, [id]: { ...current[id], ...details } }));
  }

  function goToDashboard() {
    router.replace('/');
  }

  async function handleContinue() {
    const entries = Object.entries(selected);
    if (!token || entries.length === 0) {
      goToDashboard();
      return;
    }
    const incomplete = entries.some(
      ([, details]) => details.dosage.trim().length === 0 || details.frequency.trim().length === 0
    );
    if (incomplete) {
      setError('Preencha dosagem e frequência dos medicamentos selecionados.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await submitContinuousMedications(
        token,
        entries.map(([medicationId, details]) => ({ medicationId, ...details }))
      );
    } catch {
      /* falha ao salvar não deve travar o cadastro — usuário revisa depois no perfil */
    } finally {
      setIsSubmitting(false);
      goToDashboard();
    }
  }

  return (
    <OnboardingStep
      stepIndex={3}
      totalSteps={TOTAL_STEPS}
      title="Usa algum medicamento contínuo?"
      subtitle="Selecione e informe a dosagem e a frequência de uso."
      onSkip={goToDashboard}
      onContinue={handleContinue}
      continueLabel={isSubmitting ? 'Salvando...' : 'Concluir'}
      isSubmitting={isSubmitting}>
      {isLoading ? (
        <ActivityIndicator color="#0A84FF" />
      ) : (
        <View className="gap-4">
          <OptionChipGroup
            options={medications.map((medication) => ({ id: medication.id, label: medication.name }))}
            selectedIds={Object.keys(selected)}
            onToggle={toggle}
            pickerTitle="Usa algum medicamento contínuo?"
          />

          {Object.entries(selected).map(([id, details]) => {
            const medication = medications.find((item) => item.id === id);
            return (
              <View
                key={id}
                className="gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-sm text-black dark:text-white">
                  {medication?.name}
                </Text>
                <FormField
                  label="Dosagem"
                  icon={{ ios: 'pills', android: 'medication', web: 'medication' }}
                  value={details.dosage}
                  onChangeText={(text) => updateDetails(id, { dosage: text })}
                  placeholder="Ex: 50mg"
                />
                <FormField
                  label="Frequência"
                  icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                  value={details.frequency}
                  onChangeText={(text) => updateDetails(id, { frequency: text })}
                  placeholder="Ex: 1x ao dia"
                />
              </View>
            );
          })}

          {error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-red-500">
              {error}
            </Text>
          ) : null}
        </View>
      )}
    </OnboardingStep>
  );
}
