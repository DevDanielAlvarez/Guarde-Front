import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoChip } from '@/components/info-chip';
import { ProfileSection } from '@/components/profile-section';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCpf } from '@/utils/cpf';

const MOCK_PROFILE = {
  name: 'Ana Beatriz Ferreira',
  age: 34,
  cpf: formatCpf('12345678900'),
  bloodType: 'O+',
  allergies: ['Dipirona', 'Penicilina', 'Látex'],
  conditions: ['Arritmia cardíaca', 'Lesão no joelho direito', 'Lesão no cotovelo esquerdo'],
  medications: [
    { name: 'Losartana 50mg', schedule: '1x ao dia, pela manhã' },
    { name: 'Propranolol 40mg', schedule: '2x ao dia' },
  ],
};

export default function ProfileScreen() {
  const theme = useTheme();

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
              {MOCK_PROFILE.name}
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
              {MOCK_PROFILE.age} anos · CPF {MOCK_PROFILE.cpf}
            </Text>
          </View>

          <ProfileSection
            title="Tipo sanguíneo"
            icon={{ ios: 'drop.fill', android: 'water_drop', web: 'water_drop' }}>
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-3xl text-black dark:text-white">
              {MOCK_PROFILE.bloodType}
            </Text>
          </ProfileSection>

          <ProfileSection
            title="Alergias medicamentosas"
            icon={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}>
            <View className="flex-row flex-wrap gap-2">
              {MOCK_PROFILE.allergies.map((allergy) => (
                <InfoChip key={allergy} label={allergy} tone="danger" />
              ))}
            </View>
          </ProfileSection>

          <ProfileSection
            title="Condições crônicas e lesões"
            icon={{ ios: 'bandage.fill', android: 'medical_services', web: 'medical_services' }}>
            <View className="flex-row flex-wrap gap-2">
              {MOCK_PROFILE.conditions.map((condition) => (
                <InfoChip key={condition} label={condition} />
              ))}
            </View>
          </ProfileSection>

          <ProfileSection
            title="Medicamentos de uso contínuo"
            icon={{ ios: 'pills.fill', android: 'medication', web: 'medication' }}>
            <View className="gap-3">
              {MOCK_PROFILE.medications.map((med) => (
                <View key={med.name} className="flex-row items-center justify-between">
                  <Text
                    style={{ fontFamily: Fonts.semiBold }}
                    className="text-sm text-black dark:text-white">
                    {med.name}
                  </Text>
                  <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                    {med.schedule}
                  </Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
