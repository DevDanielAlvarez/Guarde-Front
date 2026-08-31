import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoChip } from '@/components/info-chip';
import { ProfileSection } from '@/components/profile-section';
import { PrimaryButton } from '@/components/primary-button';
import { SelectableChip } from '@/components/selectable-chip';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api';
import {
  EMPTY_MEDICAL_SUMMARY,
  SEXES,
  SEX_LABELS,
  getProfile,
  updateFamilyHistories,
  updateMedicalSummary,
  updateSurgicalHistories,
  type FamilyHistoryItem,
  type MedicalSummary,
  type PatientProfile,
  type SurgicalHistoryItem,
} from '@/services/clinical-profile';

const SWITCH_TRACK_COLOR = { false: '#D1D5DB', true: '#0A84FF' };

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text
        style={{ fontFamily: Fonts.regular }}
        className="flex-1 text-sm text-black dark:text-white">
        {label}
      </Text>
      <Switch value={value} onValueChange={onChange} trackColor={SWITCH_TRACK_COLOR} thumbColor="#FFFFFF" />
    </View>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
  multiline?: boolean;
}) {
  const theme = useTheme();
  return (
    <View className="gap-1.5">
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className="text-xs uppercase tracking-wide text-muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={{ fontFamily: Fonts.regular, minHeight: multiline ? 72 : undefined }}
        className="rounded-2xl border border-transparent bg-surface-subtle px-4 py-3 text-base text-black dark:bg-neutral-800 dark:text-white"
      />
    </View>
  );
}

export default function MedicalSummaryScreen() {
  const { token } = useAuth();
  const theme = useTheme();

  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [summary, setSummary] = useState<MedicalSummary>(EMPTY_MEDICAL_SUMMARY);
  const [familyHistories, setFamilyHistories] = useState<FamilyHistoryItem[]>([]);
  const [surgicalHistories, setSurgicalHistories] = useState<SurgicalHistoryItem[]>([]);

  const [newFamilyCondition, setNewFamilyCondition] = useState('');
  const [newFamilyRelationship, setNewFamilyRelationship] = useState('');
  const [newSurgeryProcedure, setNewSurgeryProcedure] = useState('');
  const [newSurgeryPerformedAt, setNewSurgeryPerformedAt] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }
    getProfile(token)
      .then((data) => {
        setProfile(data);
        setSummary(data.medicalSummary);
        setFamilyHistories(data.familyHistories);
        setSurgicalHistories(data.surgicalHistories);
      })
      .catch(() => {
        /* tela fica vazia — usuário ainda pode preencher e tentar salvar de novo */
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  function addFamilyHistory() {
    if (newFamilyCondition.trim().length === 0 || newFamilyRelationship.trim().length === 0) {
      return;
    }
    setFamilyHistories((current) => [
      ...current,
      { condition: newFamilyCondition.trim(), relationship: newFamilyRelationship.trim() },
    ]);
    setNewFamilyCondition('');
    setNewFamilyRelationship('');
  }

  function removeFamilyHistory(index: number) {
    setFamilyHistories((current) => current.filter((_, i) => i !== index));
  }

  function addSurgicalHistory() {
    if (newSurgeryProcedure.trim().length === 0) {
      return;
    }
    setSurgicalHistories((current) => [
      ...current,
      { procedure: newSurgeryProcedure.trim(), performedAt: newSurgeryPerformedAt.trim() || null },
    ]);
    setNewSurgeryProcedure('');
    setNewSurgeryPerformedAt('');
  }

  function removeSurgicalHistory(index: number) {
    setSurgicalHistories((current) => current.filter((_, i) => i !== index));
  }

  function handleShowToDoctor() {
    if (!profile) {
      return;
    }
    router.push({
      pathname: '/medical-summary-preview',
      params: {
        // Sends the live in-memory form state (including unsaved edits),
        // not a re-fetch — the patient sees exactly what they just typed.
        data: JSON.stringify({ ...profile, medicalSummary: summary, familyHistories, surgicalHistories }),
      },
    });
  }

  async function handleSave() {
    if (!token) {
      return;
    }
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await Promise.all([
        updateMedicalSummary(token, summary),
        updateFamilyHistories(token, familyHistories),
        updateSurgicalHistories(token, surgicalHistories),
      ]);
      setSaved(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.firstError()
          : 'Não foi possível salvar o resumo médico. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center gap-3 px-4 pb-2 pt-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full bg-surface dark:bg-neutral-900">
            <Text style={{ fontSize: 18, lineHeight: 20, color: theme.text }}>✕</Text>
          </Pressable>
          <View className="flex-1">
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-2xl text-black dark:text-white">
              Resumo Médico
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
              Mostre essa tela pro médico — o que você preencher aqui fica com você
            </Text>
          </View>
        </View>

        {!isLoading && profile ? (
          <View className="px-4 pb-3">
            <PrimaryButton label="Mostrar pro médico" onPress={handleShowToDoctor} />
          </View>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#0A84FF" />
          </View>
        ) : (
          <ScrollView contentContainerClassName="gap-4 p-4 pb-8" showsVerticalScrollIndicator={false}>
            {/* Dados críticos já cadastrados — só leitura aqui, editados no Perfil/onboarding */}
            <ProfileSection
              title="Tipo sanguíneo"
              icon={{ ios: 'drop.fill', android: 'water_drop', web: 'water_drop' }}>
              <Text
                style={{ fontFamily: Fonts.extraBold }}
                className="text-2xl text-black dark:text-white">
                {profile?.bloodType ?? '—'}
              </Text>
            </ProfileSection>

            <ProfileSection
              title="Alergias medicamentosas"
              icon={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}>
              {profile && profile.allergies.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {profile.allergies.map((allergy) => (
                    <InfoChip key={allergy.id} label={allergy.medicationName} tone="danger" />
                  ))}
                </View>
              ) : (
                <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                  Nenhuma alergia registrada.
                </Text>
              )}
            </ProfileSection>

            <ProfileSection
              title="Condições crônicas e lesões"
              icon={{ ios: 'bandage.fill', android: 'medical_services', web: 'medical_services' }}>
              {profile && profile.conditions.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {profile.conditions.map((condition) => (
                    <InfoChip key={condition.id} label={condition.conditionName} />
                  ))}
                </View>
              ) : (
                <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                  Nenhuma condição registrada.
                </Text>
              )}
            </ProfileSection>

            <ProfileSection
              title="Medicamentos de uso contínuo"
              icon={{ ios: 'pills.fill', android: 'medication', web: 'medication' }}>
              {profile && profile.continuousMedications.length > 0 ? (
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
              ) : (
                <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                  Nenhum medicamento contínuo registrado.
                </Text>
              )}
            </ProfileSection>

            {/* A partir daqui, tudo é opcional e editado aqui mesmo */}
            <ProfileSection
              title="Sobre você"
              icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}>
              <View className="gap-3">
                <View className="gap-1.5">
                  <Text
                    style={{ fontFamily: Fonts.semiBold }}
                    className="text-xs uppercase tracking-wide text-muted">
                    Sexo
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {SEXES.map((sex) => (
                      <SelectableChip
                        key={sex}
                        label={SEX_LABELS[sex]}
                        selected={summary.sex === sex}
                        onPress={() =>
                          setSummary((current) => ({
                            ...current,
                            sex: current.sex === sex ? null : sex,
                          }))
                        }
                      />
                    ))}
                  </View>
                </View>
                <LabeledInput
                  label="Estado civil"
                  value={summary.maritalStatus ?? ''}
                  onChangeText={(text) => setSummary((current) => ({ ...current, maritalStatus: text }))}
                  placeholder="Ex: Solteiro(a)"
                />
                <LabeledInput
                  label="Profissão"
                  value={summary.profession ?? ''}
                  onChangeText={(text) => setSummary((current) => ({ ...current, profession: text }))}
                  placeholder="Ex: Professora"
                />
                <LabeledInput
                  label="Grau de instrução"
                  value={summary.educationLevel ?? ''}
                  onChangeText={(text) => setSummary((current) => ({ ...current, educationLevel: text }))}
                  placeholder="Ex: Ensino superior completo"
                />
                <LabeledInput
                  label="Endereço"
                  value={summary.address ?? ''}
                  onChangeText={(text) => setSummary((current) => ({ ...current, address: text }))}
                  placeholder="Rua, bairro, cidade"
                />
                <LabeledInput
                  label="Plano de saúde"
                  value={summary.healthInsurance ?? ''}
                  onChangeText={(text) => setSummary((current) => ({ ...current, healthInsurance: text }))}
                  placeholder="Ex: SUS, particular, nome do convênio"
                />
              </View>
            </ProfileSection>

            <ProfileSection
              title="Hábitos de vida"
              icon={{ ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' }}>
              <View className="gap-4">
                <View className="gap-3">
                  <ToggleRow
                    label="Fuma atualmente?"
                    value={summary.smokes ?? false}
                    onChange={(value) => setSummary((current) => ({ ...current, smokes: value }))}
                  />
                  {summary.smokes ? (
                    <>
                      <LabeledInput
                        label="Cigarros por dia"
                        value={summary.cigarettesPerDay?.toString() ?? ''}
                        onChangeText={(text) =>
                          setSummary((current) => ({
                            ...current,
                            cigarettesPerDay: text === '' ? null : Number(text.replace(/\D/g, '')),
                          }))
                        }
                        placeholder="Ex: 10"
                        keyboardType="number-pad"
                      />
                      <LabeledInput
                        label="Há quanto tempo fuma"
                        value={summary.smokingDuration ?? ''}
                        onChangeText={(text) =>
                          setSummary((current) => ({ ...current, smokingDuration: text }))
                        }
                        placeholder="Ex: 10 anos"
                      />
                    </>
                  ) : null}
                  <LabeledInput
                    label="Se já fumou e parou, há quantos anos"
                    value={summary.smokingQuitYearsAgo?.toString() ?? ''}
                    onChangeText={(text) =>
                      setSummary((current) => ({
                        ...current,
                        smokingQuitYearsAgo: text === '' ? null : Number(text.replace(/\D/g, '')),
                      }))
                    }
                    placeholder="Ex: 5"
                    keyboardType="number-pad"
                  />
                </View>

                <View className="gap-3 border-t border-hairline pt-4 dark:border-neutral-800">
                  <ToggleRow
                    label="Consome álcool?"
                    value={summary.drinksAlcohol ?? false}
                    onChange={(value) => setSummary((current) => ({ ...current, drinksAlcohol: value }))}
                  />
                  {summary.drinksAlcohol ? (
                    <LabeledInput
                      label="Doses por dia/semana"
                      value={summary.alcoholDosesPerDay ?? ''}
                      onChangeText={(text) =>
                        setSummary((current) => ({ ...current, alcoholDosesPerDay: text }))
                      }
                      placeholder="Ex: 2 doses aos fins de semana"
                    />
                  ) : null}
                  <LabeledInput
                    label="Se já bebeu e parou, há quantos anos"
                    value={summary.alcoholQuitYearsAgo?.toString() ?? ''}
                    onChangeText={(text) =>
                      setSummary((current) => ({
                        ...current,
                        alcoholQuitYearsAgo: text === '' ? null : Number(text.replace(/\D/g, '')),
                      }))
                    }
                    placeholder="Ex: 3"
                    keyboardType="number-pad"
                  />
                </View>

                <View className="gap-3 border-t border-hairline pt-4 dark:border-neutral-800">
                  <ToggleRow
                    label="Pratica atividade física?"
                    value={summary.exercises ?? false}
                    onChange={(value) => setSummary((current) => ({ ...current, exercises: value }))}
                  />
                  {summary.exercises ? (
                    <LabeledInput
                      label="Qual e com que frequência"
                      value={summary.exerciseDescription ?? ''}
                      onChangeText={(text) =>
                        setSummary((current) => ({ ...current, exerciseDescription: text }))
                      }
                      placeholder="Ex: Caminhada 30min/dia, 3x por semana"
                      multiline
                    />
                  ) : null}
                </View>
              </View>
            </ProfileSection>

            <ProfileSection
              title="Saúde mental"
              icon={{ ios: 'brain.head.profile', android: 'psychology', web: 'psychology' }}>
              <View className="gap-3">
                <ToggleRow
                  label="Histórico de depressão ou ansiedade"
                  value={summary.mentalHealthHistory ?? false}
                  onChange={(value) =>
                    setSummary((current) => ({ ...current, mentalHealthHistory: value }))
                  }
                />
                <ToggleRow
                  label="Já fez ou faz uso de medicamento"
                  value={summary.mentalHealthMedication ?? false}
                  onChange={(value) =>
                    setSummary((current) => ({ ...current, mentalHealthMedication: value }))
                  }
                />
                <ToggleRow
                  label="Já fez ou faz terapia"
                  value={summary.mentalHealthTherapy ?? false}
                  onChange={(value) =>
                    setSummary((current) => ({ ...current, mentalHealthTherapy: value }))
                  }
                />
              </View>
            </ProfileSection>

            <ProfileSection
              title="Antecedentes familiares"
              icon={{ ios: 'person.2.fill', android: 'diversity_1', web: 'diversity_1' }}>
              <View className="gap-3">
                {familyHistories.map((item, index) => (
                  <View
                    key={`${item.condition}-${item.relationship}-${index}`}
                    className="flex-row items-center justify-between gap-2 rounded-2xl bg-surface-subtle px-4 py-3 dark:bg-neutral-800">
                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className="flex-1 text-sm text-black dark:text-white">
                      {item.condition} — {item.relationship}
                    </Text>
                    <Pressable onPress={() => removeFamilyHistory(index)} hitSlop={8}>
                      <Text style={{ fontSize: 16, color: theme.textSecondary }}>✕</Text>
                    </Pressable>
                  </View>
                ))}
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <LabeledInput
                      label="Condição"
                      value={newFamilyCondition}
                      onChangeText={setNewFamilyCondition}
                      placeholder="Ex: Diabetes"
                    />
                  </View>
                  <View className="flex-1">
                    <LabeledInput
                      label="Parentesco"
                      value={newFamilyRelationship}
                      onChangeText={setNewFamilyRelationship}
                      placeholder="Ex: Mãe"
                    />
                  </View>
                </View>
                <Pressable
                  onPress={addFamilyHistory}
                  className="items-center rounded-full border border-primary py-3">
                  <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-primary">
                    + Adicionar
                  </Text>
                </Pressable>
              </View>
            </ProfileSection>

            <ProfileSection
              title="Cirurgias anteriores"
              icon={{ ios: 'cross.case.fill', android: 'medical_information', web: 'medical_information' }}>
              <View className="gap-3">
                {surgicalHistories.map((item, index) => (
                  <View
                    key={`${item.procedure}-${index}`}
                    className="flex-row items-center justify-between gap-2 rounded-2xl bg-surface-subtle px-4 py-3 dark:bg-neutral-800">
                    <Text
                      style={{ fontFamily: Fonts.medium }}
                      className="flex-1 text-sm text-black dark:text-white">
                      {item.procedure}
                      {item.performedAt ? ` — ${item.performedAt}` : ''}
                    </Text>
                    <Pressable onPress={() => removeSurgicalHistory(index)} hitSlop={8}>
                      <Text style={{ fontSize: 16, color: theme.textSecondary }}>✕</Text>
                    </Pressable>
                  </View>
                ))}
                <LabeledInput
                  label="Procedimento"
                  value={newSurgeryProcedure}
                  onChangeText={setNewSurgeryProcedure}
                  placeholder="Ex: Apendicectomia"
                />
                <LabeledInput
                  label="Ano ou idade (opcional)"
                  value={newSurgeryPerformedAt}
                  onChangeText={setNewSurgeryPerformedAt}
                  placeholder="Ex: 2015 ou aos 20 anos"
                />
                <Pressable
                  onPress={addSurgicalHistory}
                  className="items-center rounded-full border border-primary py-3">
                  <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-primary">
                    + Adicionar
                  </Text>
                </Pressable>
              </View>
            </ProfileSection>

            {error ? (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-red-500">
                {error}
              </Text>
            ) : null}
            {saved ? (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-primary">
                Resumo médico salvo.
              </Text>
            ) : null}

            <PrimaryButton
              label={isSaving ? 'Salvando...' : 'Salvar resumo médico'}
              onPress={handleSave}
              disabled={isSaving}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
