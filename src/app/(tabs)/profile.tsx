import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoChip } from '@/components/info-chip';
import { ProfileSection } from '@/components/profile-section';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { getProfile, type PatientProfile } from '@/services/clinical-profile';
import { formatCpf } from '@/utils/cpf';

export default function ProfileScreen() {
  const theme = useTheme();
  const { token } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        return;
      }
      let cancelled = false;
      getProfile(token)
        .then((data) => {
          if (!cancelled) {
            setProfile(data);
          }
        })
        .catch(() => {
          /* mantém os dados já carregados na tela em caso de falha */
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        });
      return () => {
        cancelled = true;
      };
    }, [token])
  );

  if (isLoading || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-subtle dark:bg-black">
        <ActivityIndicator color="#0A84FF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row justify-end px-4 pt-2">
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-neutral-900">
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              tintColor={theme.textSecondary}
              size={20}
            />
          </Pressable>
        </View>

        <ScrollView
          style={{ marginBottom: BottomTabInset }}
          contentContainerClassName="gap-4 p-4 pb-8"
          showsVerticalScrollIndicator={false}>
          <View className="items-center gap-1 pb-2 pt-4">
            <Image
              source={require('@/assets/images/profile/profile_avatar.jpg')}
              className="h-24 w-24 rounded-full border border-hairline dark:border-neutral-800"
              contentFit="cover"
            />
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="mt-3 text-2xl text-black dark:text-white">
              {profile.name}
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
              {[
                profile.age ? `${profile.age} anos` : null,
                profile.cpf ? `CPF ${formatCpf(profile.cpf)}` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>

          <ProfileSection
            title="Tipo sanguíneo"
            icon={{ ios: 'drop.fill', android: 'water_drop', web: 'water_drop' }}>
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-3xl text-black dark:text-white">
              {profile.bloodType ?? '—'}
            </Text>
          </ProfileSection>

          <ProfileSection
            title="Alergias medicamentosas"
            icon={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}>
            {profile.allergies.length > 0 ? (
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
            {profile.conditions.length > 0 ? (
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
            {profile.continuousMedications.length > 0 ? (
              <View className="gap-3">
                {profile.continuousMedications.map((medication) => (
                  <View key={medication.id} className="flex-row items-center justify-between">
                    <Text
                      style={{ fontFamily: Fonts.semiBold }}
                      className="text-sm text-black dark:text-white">
                      {medication.medicationName} {medication.dosage}
                    </Text>
                    <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                      {medication.frequency}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                Nenhum medicamento contínuo registrado.
              </Text>
            )}
          </ProfileSection>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
