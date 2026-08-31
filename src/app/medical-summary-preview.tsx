import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoChip } from '@/components/info-chip';
import { PrimaryButton } from '@/components/primary-button';
import { ProfileSection } from '@/components/profile-section';
import { Fonts } from '@/constants/theme';
import { ALLERGY_SEVERITY_LABELS, SEX_LABELS, type PatientProfile } from '@/services/clinical-profile';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3">
      <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
        {label}
      </Text>
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className="flex-1 text-right text-sm text-black dark:text-white">
        {value}
      </Text>
    </View>
  );
}

export default function MedicalSummaryPreviewScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-surface-subtle px-8 dark:bg-black">
        <Text style={{ fontFamily: Fonts.regular }} className="text-center text-sm text-muted">
          Nada pra mostrar ainda. Volte e abra pelo Resumo Médico.
        </Text>
        <PrimaryButton label="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  const profile: PatientProfile = JSON.parse(data);
  const summary = profile.medicalSummary;

  const aboutRows: [string, string][] = [
    summary.sex ? ['Sexo', SEX_LABELS[summary.sex]] : null,
    summary.maritalStatus ? ['Estado civil', summary.maritalStatus] : null,
    summary.profession ? ['Profissão', summary.profession] : null,
    summary.educationLevel ? ['Grau de instrução', summary.educationLevel] : null,
    summary.address ? ['Endereço', summary.address] : null,
    summary.healthInsurance ? ['Plano de saúde', summary.healthInsurance] : null,
  ].filter((row): row is [string, string] => row !== null);

  let smokingLine: string | null = null;
  if (summary.smokes) {
    smokingLine =
      'Fumante' +
      (summary.cigarettesPerDay ? `, ${summary.cigarettesPerDay} cigarros/dia` : '') +
      (summary.smokingDuration ? ` há ${summary.smokingDuration}` : '');
  } else if (summary.smokes === false && summary.smokingQuitYearsAgo) {
    smokingLine = `Ex-fumante — parou há ${summary.smokingQuitYearsAgo} anos`;
  } else if (summary.smokes === false) {
    smokingLine = 'Não fumante';
  }

  let alcoholLine: string | null = null;
  if (summary.drinksAlcohol) {
    alcoholLine = 'Consome álcool' + (summary.alcoholDosesPerDay ? `, ${summary.alcoholDosesPerDay}` : '');
  } else if (summary.drinksAlcohol === false && summary.alcoholQuitYearsAgo) {
    alcoholLine = `Ex-etilista — parou há ${summary.alcoholQuitYearsAgo} anos`;
  } else if (summary.drinksAlcohol === false) {
    alcoholLine = 'Não consome álcool';
  }

  let exerciseLine: string | null = null;
  if (summary.exercises) {
    exerciseLine =
      'Pratica atividade física' + (summary.exerciseDescription ? `: ${summary.exerciseDescription}` : '');
  } else if (summary.exercises === false) {
    exerciseLine = 'Sedentário(a)';
  }

  const habitLines = [smokingLine, alcoholLine, exerciseLine].filter((line): line is string => line !== null);

  const mentalHealthFlags = [
    summary.mentalHealthHistory ? 'Histórico de depressão ou ansiedade' : null,
    summary.mentalHealthMedication ? 'Já fez ou faz uso de medicamento psiquiátrico' : null,
    summary.mentalHealthTherapy ? 'Já fez ou faz terapia' : null,
  ].filter((flag): flag is string => flag !== null);

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="px-4 pb-2 pt-2">
          <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs uppercase tracking-wide text-muted">
            Resumo para o médico
          </Text>
          <Text style={{ fontFamily: Fonts.extraBold }} className="text-3xl text-black dark:text-white">
            {profile.name}
          </Text>
          {profile.age ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
              {profile.age} anos
            </Text>
          ) : null}
        </View>

        <ScrollView contentContainerClassName="gap-4 p-4 pb-8" showsVerticalScrollIndicator={false}>
          <View className="gap-3 rounded-3xl bg-primary p-5">
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs uppercase tracking-wide text-white/80">
                Tipo sanguíneo
              </Text>
              <Text style={{ fontFamily: Fonts.extraBold }} className="text-2xl text-white">
                {profile.bloodType ?? 'Não informado'}
              </Text>
            </View>
            {profile.allergies.length > 0 ? (
              <View className="gap-1 border-t border-white/20 pt-3">
                <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs uppercase tracking-wide text-white/80">
                  Alergias medicamentosas
                </Text>
                {profile.allergies.map((allergy) => (
                  <Text key={allergy.id} style={{ fontFamily: Fonts.semiBold }} className="text-base text-white">
                    {allergy.medicationName} — {ALLERGY_SEVERITY_LABELS[allergy.severity]}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          {profile.conditions.length > 0 ? (
            <ProfileSection
              title="Condições crônicas e lesões"
              icon={{ ios: 'bandage.fill', android: 'medical_services', web: 'medical_services' }}>
              <View className="flex-row flex-wrap gap-2">
                {profile.conditions.map((condition) => (
                  <InfoChip key={condition.id} label={condition.conditionName} />
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {profile.continuousMedications.length > 0 ? (
            <ProfileSection
              title="Medicamentos de uso contínuo"
              icon={{ ios: 'pills.fill', android: 'medication', web: 'medication' }}>
              <View className="gap-2">
                {profile.continuousMedications.map((medication) => (
                  <Text
                    key={medication.id}
                    style={{ fontFamily: Fonts.medium }}
                    className="text-sm text-black dark:text-white">
                    {medication.medicationName} — {medication.dosage}, {medication.frequency}
                  </Text>
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {aboutRows.length > 0 ? (
            <ProfileSection
              title="Sobre o paciente"
              icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}>
              <View className="gap-2">
                {aboutRows.map(([label, value]) => (
                  <Row key={label} label={label} value={value} />
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {habitLines.length > 0 ? (
            <ProfileSection
              title="Hábitos de vida"
              icon={{ ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' }}>
              <View className="gap-1.5">
                {habitLines.map((line) => (
                  <Text
                    key={line}
                    style={{ fontFamily: Fonts.regular }}
                    className="text-sm text-black dark:text-white">
                    {line}
                  </Text>
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {mentalHealthFlags.length > 0 ? (
            <ProfileSection
              title="Saúde mental"
              icon={{ ios: 'brain.head.profile', android: 'psychology', web: 'psychology' }}>
              <View className="gap-1.5">
                {mentalHealthFlags.map((flag) => (
                  <Text
                    key={flag}
                    style={{ fontFamily: Fonts.regular }}
                    className="text-sm text-black dark:text-white">
                    {flag}
                  </Text>
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {profile.familyHistories.length > 0 ? (
            <ProfileSection
              title="Antecedentes familiares"
              icon={{ ios: 'person.2.fill', android: 'diversity_1', web: 'diversity_1' }}>
              <View className="gap-1.5">
                {profile.familyHistories.map((item, index) => (
                  <Text
                    key={`${item.condition}-${index}`}
                    style={{ fontFamily: Fonts.regular }}
                    className="text-sm text-black dark:text-white">
                    {item.condition} — {item.relationship}
                  </Text>
                ))}
              </View>
            </ProfileSection>
          ) : null}

          {profile.surgicalHistories.length > 0 ? (
            <ProfileSection
              title="Cirurgias anteriores"
              icon={{ ios: 'cross.case.fill', android: 'medical_information', web: 'medical_information' }}>
              <View className="gap-1.5">
                {profile.surgicalHistories.map((item, index) => (
                  <Text
                    key={`${item.procedure}-${index}`}
                    style={{ fontFamily: Fonts.regular }}
                    className="text-sm text-black dark:text-white">
                    {item.procedure}
                    {item.performedAt ? ` — ${item.performedAt}` : ''}
                  </Text>
                ))}
              </View>
            </ProfileSection>
          ) : null}

          <PrimaryButton label="Voltar" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
