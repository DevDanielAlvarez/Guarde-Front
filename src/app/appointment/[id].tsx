import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api';
import { cancelAppointment, recordAppointmentOutcome, type Appointment } from '@/services/appointments';
import { formatAppointmentDateTime } from '@/utils/date';

const STATUS_LABEL: Record<Appointment['status'], string> = {
  scheduled: 'Agendada',
  completed: 'Realizada',
  cancelled: 'Cancelada',
};

export default function AppointmentDetailsScreen() {
  const { id, appointment: appointmentParam } = useLocalSearchParams<{
    id: string;
    appointment?: string;
  }>();
  const { token } = useAuth();
  const theme = useTheme();

  const [appointment, setAppointment] = useState<Appointment | null>(
    appointmentParam ? (JSON.parse(appointmentParam) as Appointment) : null
  );
  const [cancelReason, setCancelReason] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSavingOutcome, setIsSavingOutcome] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-subtle dark:bg-black">
        <Text style={{ fontFamily: Fonts.regular }} className="text-black dark:text-white">
          Consulta não encontrada.
        </Text>
      </View>
    );
  }

  async function handleCancel() {
    if (!token) {
      return;
    }
    Alert.alert('Cancelar consulta', 'Tem certeza que deseja cancelar essa consulta?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: async () => {
          setError(null);
          setIsCancelling(true);
          try {
            const response = await cancelAppointment(token, id, cancelReason.trim() || undefined);
            setAppointment(response.data);
          } catch (caughtError) {
            setError(
              caughtError instanceof ApiError
                ? caughtError.firstError()
                : 'Não foi possível cancelar a consulta.'
            );
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  }

  async function handleSaveOutcome() {
    if (!token) {
      return;
    }
    if (outcomeNotes.trim().length === 0) {
      setError('Descreva o que aconteceu na consulta.');
      return;
    }

    setError(null);
    setIsSavingOutcome(true);
    try {
      const response = await recordAppointmentOutcome(token, id, outcomeNotes.trim());
      setAppointment(response.data);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError ? caughtError.firstError() : 'Não foi possível salvar o registro.'
      );
    } finally {
      setIsSavingOutcome(false);
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
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              tintColor="#0B0B0C"
              size={16}
            />
          </Pressable>
          <Text
            style={{ fontFamily: Fonts.extraBold }}
            className="flex-1 text-2xl text-black dark:text-white"
            numberOfLines={1}>
            {appointment.title}
          </Text>
        </View>

        <ScrollView contentContainerClassName="gap-5 p-4 pb-8" showsVerticalScrollIndicator={false}>
          <View className="gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <View className="flex-row items-center gap-2">
              <SymbolView
                name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                tintColor={theme.textSecondary}
                size={16}
              />
              <Text style={{ fontFamily: Fonts.medium }} className="text-sm text-black dark:text-white">
                {formatAppointmentDateTime(appointment.scheduled_at)}
              </Text>
            </View>

            {appointment.location ? (
              <View className="flex-row items-center gap-2">
                <SymbolView
                  name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
                  tintColor={theme.textSecondary}
                  size={16}
                />
                <Text style={{ fontFamily: Fonts.medium }} className="text-sm text-black dark:text-white">
                  {appointment.location}
                </Text>
              </View>
            ) : null}

            <View className="self-start rounded-full bg-primary/10 px-3 py-1">
              <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs text-primary">
                {STATUS_LABEL[appointment.status]}
              </Text>
            </View>
          </View>

          {error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-red-500">
              {error}
            </Text>
          ) : null}

          {appointment.status === 'scheduled' ? (
            <>
              <View className="gap-3">
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-xs uppercase tracking-wide text-muted">
                  O que aconteceu
                </Text>
                <TextInput
                  value={outcomeNotes}
                  onChangeText={setOutcomeNotes}
                  placeholder="Anotações, diagnóstico e recomendações do médico"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ fontFamily: Fonts.regular, minHeight: 96 }}
                  className="rounded-2xl border border-transparent bg-surface-subtle px-4 py-3.5 text-base text-black dark:bg-neutral-800 dark:text-white"
                />
                <PrimaryButton
                  label={isSavingOutcome ? 'Salvando...' : 'Salvar registro'}
                  onPress={handleSaveOutcome}
                  disabled={isSavingOutcome}
                />
              </View>

              <View className="gap-3">
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-xs uppercase tracking-wide text-muted">
                  Cancelar consulta
                </Text>
                <TextInput
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  placeholder="Motivo (opcional)"
                  placeholderTextColor={theme.textSecondary}
                  style={{ fontFamily: Fonts.regular }}
                  className="rounded-full border border-transparent bg-surface-subtle px-5 py-3.5 text-base text-black dark:bg-neutral-800 dark:text-white"
                />
                <Pressable
                  onPress={handleCancel}
                  disabled={isCancelling}
                  className="items-center rounded-full border border-red-400 py-4">
                  <Text style={{ fontFamily: Fonts.semiBold }} className="text-base text-red-500">
                    {isCancelling ? 'Cancelando...' : 'Cancelar consulta'}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : null}

          {appointment.status === 'completed' && appointment.notes ? (
            <View className="gap-2">
              <Text
                style={{ fontFamily: Fonts.semiBold }}
                className="text-xs uppercase tracking-wide text-muted">
                O que aconteceu
              </Text>
              <Text style={{ fontFamily: Fonts.regular }} className="text-base text-black dark:text-white">
                {appointment.notes}
              </Text>
            </View>
          ) : null}

          {appointment.status === 'cancelled' ? (
            <View className="gap-2">
              <Text
                style={{ fontFamily: Fonts.semiBold }}
                className="text-xs uppercase tracking-wide text-muted">
                Motivo do cancelamento
              </Text>
              <Text style={{ fontFamily: Fonts.regular }} className="text-base text-black dark:text-white">
                {appointment.cancellation_reason ?? 'Nenhum motivo informado.'}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
