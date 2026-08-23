import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/appointment-card';
import { MiniCalendar } from '@/components/mini-calendar';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { listAppointments, type Appointment } from '@/services/appointments';
import { formatAppointmentDateTime } from '@/utils/date';

export default function CalendarScreen() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        return;
      }
      listAppointments(token)
        .then((response) => setAppointments(response.data))
        .catch(() => {
          /* keeps the previous list on screen if a refresh fails */
        });
    }, [token])
  );

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          style={{ marginBottom: BottomTabInset }}
          contentContainerClassName="p-4 pb-8"
          showsVerticalScrollIndicator={false}>
          <View className="gap-5 rounded-[32px] bg-surface p-5 shadow-sm shadow-black/10 dark:bg-neutral-900">
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-3xl text-black dark:text-white">
              Suas Consultas
            </Text>

            <MiniCalendar year={2026} month={2} />

            <View className="gap-3">
              {appointments.length === 0 ? (
                <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                  Nenhuma consulta agendada ainda.
                </Text>
              ) : (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    title={appointment.title}
                    date={formatAppointmentDateTime(appointment.scheduled_at)}
                    status={appointment.status}
                    onPress={() =>
                      router.push({
                        pathname: '/appointment/[id]',
                        params: { id: appointment.id, appointment: JSON.stringify(appointment) },
                      })
                    }
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Pressable
        onPress={() => router.push('/schedule-appointment')}
        className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/30"
        style={{ bottom: BottomTabInset + 16 }}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#FFFFFF" size={24} />
      </Pressable>
    </View>
  );
}
