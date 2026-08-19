import { SymbolView } from 'expo-symbols';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/appointment-card';
import { MiniCalendar } from '@/components/mini-calendar';
import { BottomTabInset, Fonts } from '@/constants/theme';

const MOCK_APPOINTMENTS = [
  { id: '1', title: 'Cardiologista', date: '12/03/2026' },
  { id: '2', title: 'Ortopedista', date: '15/03/2026' },
  { id: '3', title: 'Exame de sangue', date: '19/03/2026' },
  { id: '4', title: 'Exame de urina', date: '25/03/2026' },
];

export default function CalendarScreen() {
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
              {MOCK_APPOINTMENTS.map((item) => (
                <AppointmentCard key={item.id} title={item.title} date={item.date} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View
        className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/30"
        style={{ bottom: BottomTabInset + 16 }}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#FFFFFF" size={24} />
      </View>
    </View>
  );
}
