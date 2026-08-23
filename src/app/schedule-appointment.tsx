import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api';
import { scheduleAppointment } from '@/services/appointments';
import {
  formatDateInput,
  formatTimeInput,
  isValidFutureDateTimeInput,
  toIsoDateTime,
} from '@/utils/date';

export default function ScheduleAppointmentScreen() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!token) {
      return;
    }
    if (title.trim().length === 0) {
      setError('Dê um título pra consulta.');
      return;
    }
    if (!isValidFutureDateTimeInput(date, time)) {
      setError('Informe uma data e hora futuras válidas.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await scheduleAppointment(token, {
        title: title.trim(),
        location: location.trim() || undefined,
        scheduledAt: toIsoDateTime(date, time),
      });
      router.back();
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError ? caughtError.firstError() : 'Não foi possível agendar a consulta.'
      );
    } finally {
      setIsSubmitting(false);
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
            className="text-2xl text-black dark:text-white">
            Nova consulta
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="gap-4 p-4 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <FormField
            label="Título"
            icon={{ ios: 'stethoscope', android: 'stethoscope', web: 'stethoscope' }}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Cardiologista"
          />

          <FormField
            label="Local (opcional)"
            icon={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Clínica Central"
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Data"
                icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                value={date}
                onChangeText={(text) => setDate(formatDateInput(text))}
                placeholder="dd/mm/aaaa"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Hora"
                icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                value={time}
                onChangeText={(text) => setTime(formatTimeInput(text))}
                placeholder="hh:mm"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </View>

          {error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-red-500">
              {error}
            </Text>
          ) : null}

          <PrimaryButton
            label={isSubmitting ? 'Agendando...' : 'Agendar consulta'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
