import { router, useFocusEffect, useNavigation } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/appointment-card';
import { ExamFileCard } from '@/components/exam-file-card';
import { ProfileSection } from '@/components/profile-section';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { listAppointments, type Appointment } from '@/services/appointments';
import { getProfile, type PatientProfile } from '@/services/clinical-profile';
import { listExamAttachments, type ExamAttachment } from '@/services/exams';
import { formatAppointmentDateTime } from '@/utils/date';

const RECENT_EXAMS_LIMIT = 3;
const VISIT_LOG_LIMIT = 2;

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
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exams, setExams] = useState<ExamAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!token) {
      return;
    }
    const [profileResult, appointmentsResult, examsResult] = await Promise.allSettled([
      getProfile(token),
      listAppointments(token),
      listExamAttachments(token),
    ]);
    if (profileResult.status === 'fulfilled') {
      setProfile(profileResult.value);
    }
    if (appointmentsResult.status === 'fulfilled') {
      setAppointments(appointmentsResult.value.data);
    }
    if (examsResult.status === 'fulfilled') {
      setExams(examsResult.value.data);
    }
    setIsLoading(false);
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const firstName = (profile?.name ?? user?.name ?? '').split(' ')[0];

  const nextAppointment = appointments
    .filter((appointment) => appointment.status === 'scheduled')
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];

  const recentExams = [...exams]
    .sort((a, b) => (b.exam_date ?? '').localeCompare(a.exam_date ?? ''))
    .slice(0, RECENT_EXAMS_LIMIT);

  const visitLog = appointments
    .filter((appointment) => appointment.status === 'completed' && appointment.notes)
    .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at))
    .slice(0, VISIT_LOG_LIMIT);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-subtle dark:bg-black">
        <ActivityIndicator color="#0A84FF" />
      </View>
    );
  }

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
              Olá{firstName ? `, ${firstName}` : ''}
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
              {profile?.name ?? user?.name ?? '—'}
            </Text>
            <View className="flex-row gap-8">
              <View className="gap-0.5">
                <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-white/70">
                  Tipo sanguíneo
                </Text>
                <Text style={{ fontFamily: Fonts.extraBold }} className="text-lg text-white">
                  {profile?.bloodType ?? '—'}
                </Text>
              </View>
              <View className="gap-0.5">
                <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-white/70">
                  Alergias registradas
                </Text>
                <Text style={{ fontFamily: Fonts.extraBold }} className="text-lg text-white">
                  {profile?.allergies.length ?? 0}
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
            {nextAppointment ? (
              <AppointmentCard
                title={nextAppointment.title}
                date={formatAppointmentDateTime(nextAppointment.scheduled_at)}
                status={nextAppointment.status}
                onPress={() => navigation.navigate('calendar')}
              />
            ) : (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                Nenhuma consulta agendada.
              </Text>
            )}
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
            {recentExams.length === 0 ? (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                Nenhum exame anexado ainda.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-3">
                {recentExams.map((exam) => (
                  <View key={exam.id} className="w-28">
                    <ExamFileCard
                      name={exam.title}
                      date={exam.exam_date ?? ''}
                      type="image"
                      uri={exam.url}
                      token={token}
                      wide
                      onPress={() => navigation.navigate('files')}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <ProfileSection
            title="Diário de consultas"
            icon={{ ios: 'note.text', android: 'description', web: 'description' }}>
            {visitLog.length === 0 ? (
              <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                Nenhum registro de consulta ainda.
              </Text>
            ) : (
              <View className="gap-4">
                {visitLog.map((appointment) => (
                  <View key={appointment.id} className="gap-1">
                    <View className="flex-row items-center justify-between">
                      <Text
                        style={{ fontFamily: Fonts.semiBold }}
                        className="flex-1 text-sm text-black dark:text-white">
                        {appointment.title}
                      </Text>
                      <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                        {formatAppointmentDateTime(appointment.scheduled_at)}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
                      {appointment.notes}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ProfileSection>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
