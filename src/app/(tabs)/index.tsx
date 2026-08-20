import { router, useNavigation } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/appointment-card';
import { ExamFileCard } from '@/components/exam-file-card';
import { ProfileSection } from '@/components/profile-section';
import { BottomTabInset, Fonts } from '@/constants/theme';

const MOCK_PROFILE = {
  name: 'Ana Beatriz Ferreira',
  bloodType: 'O+',
  allergyCount: 3,
};

const NEXT_APPOINTMENT = {
  title: 'Cardiologista — Dra. Camila Nogueira',
  date: '12/03/2026 às 14h30',
};

const RECENT_EXAMS = [
  { id: '1', name: 'Raio-x do joelho', date: '12/03/2026', type: 'image' as const },
  { id: '2', name: 'Hemograma completo', date: '05/03/2026', type: 'document' as const },
  { id: '3', name: 'Raio-x do cotovelo', date: '01/03/2026', type: 'image' as const },
];

const VISIT_LOG = [
  {
    id: '1',
    doctor: 'Dra. Camila Nogueira — Cardiologia',
    date: '18/02/2026',
    note: 'Ajuste de dose do Propranolol. Retorno em 4 semanas para reavaliar a arritmia.',
  },
  {
    id: '2',
    doctor: 'Dr. Renato Silva — Ortopedia',
    date: '03/02/2026',
    note: 'Fisioterapia liberada para o joelho direito, 2x por semana.',
  },
];

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: SymbolViewProps['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900"
      style={({ pressed }) => pressed && { opacity: 0.85 }}>
      <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/15">
        <SymbolView name={icon} tintColor="#0A84FF" size={20} />
      </View>
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className="text-center text-xs text-black dark:text-white">
        {label}
      </Text>
    </Pressable>
  );
}

function SectionLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs text-primary">
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  // These sibling screens are tabs inside the custom `Tab.Navigator` mounted by
  // (tabs)/_layout.tsx, not expo-router routes — `router.push` can't reach them,
  // so cross-tab links go through this navigator's own `navigate` instead.
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          style={{ marginBottom: BottomTabInset }}
          contentContainerClassName="gap-4 p-4 pb-8"
          showsVerticalScrollIndicator={false}>
          <View className="gap-0.5 pb-1 pt-2">
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-2xl text-black dark:text-white">
              Olá, {MOCK_PROFILE.name.split(' ')[0]}
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
              Aqui está um resumo da sua saúde hoje
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('profile')}
            className="gap-3 rounded-3xl bg-primary p-5"
            style={({ pressed }) => pressed && { opacity: 0.9 }}>
            <View className="flex-row items-center justify-between">
              <Text
                style={{ fontFamily: Fonts.semiBold }}
                className="text-xs uppercase tracking-wide text-white/80">
                ID de emergência
              </Text>
              <SymbolView
                name={{ ios: 'bolt.heart.fill', android: 'emergency', web: 'emergency' }}
                tintColor="#FFFFFF"
                size={18}
              />
            </View>
            <Text style={{ fontFamily: Fonts.extraBold }} className="text-xl text-white">
              {MOCK_PROFILE.name}
            </Text>
            <View className="flex-row gap-8">
              <View className="gap-0.5">
                <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-white/70">
                  Tipo sanguíneo
                </Text>
                <Text style={{ fontFamily: Fonts.extraBold }} className="text-lg text-white">
                  {MOCK_PROFILE.bloodType}
                </Text>
              </View>
              <View className="gap-0.5">
                <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-white/70">
                  Alergias registradas
                </Text>
                <Text style={{ fontFamily: Fonts.extraBold }} className="text-lg text-white">
                  {MOCK_PROFILE.allergyCount}
                </Text>
              </View>
            </View>
            <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-white/70">
              Toque para ver o perfil clínico completo
            </Text>
          </Pressable>

          <View className="flex-row gap-3">
            <QuickAction
              icon={{
                ios: 'doc.text.magnifyingglass',
                android: 'summarize',
                web: 'summarize',
              }}
              label="Resumo médico"
              onPress={() => router.push('/medical-summary')}
            />
            <QuickAction
              icon={{
                ios: 'bubble.left.and.bubble.right.fill',
                android: 'chat',
                web: 'chat',
              }}
              label="Assistente IA"
              onPress={() => router.push('/chat')}
            />
          </View>

          <ProfileSection
            title="Próxima consulta"
            icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}>
            <AppointmentCard title={NEXT_APPOINTMENT.title} date={NEXT_APPOINTMENT.date} />
            <SectionLink
              label="Ver agenda completa"
              onPress={() => navigation.navigate('calendar')}
            />
          </ProfileSection>

          <View className="gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <SymbolView
                  name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
                  tintColor="#60646C"
                  size={16}
                />
                <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-muted">
                  Exames recentes
                </Text>
              </View>
              <SectionLink label="Ver todos" onPress={() => navigation.navigate('files')} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
              {RECENT_EXAMS.map((exam) => (
                <View key={exam.id} className="w-28">
                  <ExamFileCard name={exam.name} date={exam.date} type={exam.type} wide />
                </View>
              ))}
            </ScrollView>
          </View>

          <ProfileSection
            title="Diário de consultas"
            icon={{ ios: 'note.text', android: 'description', web: 'description' }}>
            <View className="gap-4">
              {VISIT_LOG.map((entry) => (
                <View key={entry.id} className="gap-1">
                  <View className="flex-row items-center justify-between">
                    <Text
                      style={{ fontFamily: Fonts.semiBold }}
                      className="flex-1 text-sm text-black dark:text-white">
                      {entry.doctor}
                    </Text>
                    <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                      {entry.date}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                    {entry.note}
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
