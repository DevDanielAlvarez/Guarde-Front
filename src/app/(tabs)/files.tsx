import { SymbolView } from 'expo-symbols';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamFileCard } from '@/components/exam-file-card';
import { FolderChip } from '@/components/folder-chip';
import { BottomTabInset, Fonts } from '@/constants/theme';

const MOCK_FOLDERS = [
  { id: '1', name: 'Exames' },
  { id: '2', name: 'Raios-x' },
  { id: '3', name: 'Diabetes' },
  { id: '4', name: 'Joelho' },
];

const MOCK_FILES = [
  { id: '1', name: 'Raio-x do joelho', date: '12/03/2026', type: 'image' as const, wide: true },
  { id: '2', name: 'Raio-x do cotovelo', date: '08/03/2026', type: 'image' as const, wide: false },
  { id: '3', name: 'Hemograma completo', date: '05/03/2026', type: 'document' as const, wide: false },
  { id: '4', name: 'Raio-x do cotovelo', date: '01/03/2026', type: 'image' as const, wide: false },
];

export default function FilesScreen() {
  const wideFiles = MOCK_FILES.filter((file) => file.wide);
  const regularFiles = MOCK_FILES.filter((file) => !file.wide);

  return (
    <View className="flex-1 bg-surface-subtle dark:bg-black">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          style={{ marginBottom: BottomTabInset }}
          contentContainerClassName="p-4 pb-8"
          showsVerticalScrollIndicator={false}>
          <Text
            style={{ fontFamily: Fonts.extraBold }}
            className="mb-5 text-3xl text-black dark:text-white">
            Seus Arquivos
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-6">
            {MOCK_FOLDERS.map((folder) => (
              <FolderChip key={folder.id} name={folder.name} />
            ))}
          </ScrollView>

          <View className="gap-3">
            {wideFiles.map((file) => (
              <ExamFileCard key={file.id} name={file.name} date={file.date} type={file.type} wide />
            ))}

            <View className="flex-row flex-wrap gap-3">
              {regularFiles.map((file) => (
                <ExamFileCard key={file.id} name={file.name} date={file.date} type={file.type} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View
        className="absolute right-6 h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-black/30"
        style={{ bottom: BottomTabInset + 16 }}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#FFFFFF" size={24} />
      </View>
    </View>
  );
}
