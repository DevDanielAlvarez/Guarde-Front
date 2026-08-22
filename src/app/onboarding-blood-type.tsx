import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { OnboardingStep } from '@/components/onboarding-step';
import { SelectableChip } from '@/components/selectable-chip';
import { useAuth } from '@/contexts/auth-context';
import { BLOOD_TYPES, updateBloodType, type BloodType } from '@/services/clinical-profile';

const TOTAL_STEPS = 4;

export default function OnboardingBloodTypeScreen() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<BloodType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    if (!token || !selected) {
      router.replace('/onboarding-continuous-medications');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateBloodType(token, selected);
    } catch {
      /* falha ao salvar não deve travar o cadastro — usuário revisa depois no perfil */
    } finally {
      setIsSubmitting(false);
      router.replace('/onboarding-continuous-medications');
    }
  }

  return (
    <OnboardingStep
      stepIndex={2}
      totalSteps={TOTAL_STEPS}
      title="Qual seu tipo sanguíneo?"
      subtitle="Essa informação fica disponível na sua carteira de identificação de emergência."
      onSkip={() => router.replace('/onboarding-continuous-medications')}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}>
      <View className="flex-row flex-wrap gap-2">
        {BLOOD_TYPES.map((bloodType) => (
          <SelectableChip
            key={bloodType}
            label={bloodType}
            selected={selected === bloodType}
            onPress={() => setSelected((current) => (current === bloodType ? null : bloodType))}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}
