import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamFileCard } from '@/components/exam-file-card';
import { FolderChip } from '@/components/folder-chip';
import { BottomTabInset, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api';
import {
  deleteExamAttachment,
  listExamAttachments,
  listFolders,
  type ExamAttachment,
  type Folder,
} from '@/services/exams';

export default function FilesScreen() {
  const { token } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [attachments, setAttachments] = useState<ExamAttachment[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) {
      return;
    }
    setError(null);
    try {
      const [foldersResponse, attachmentsResponse] = await Promise.all([
        listFolders(token),
        listExamAttachments(token),
      ]);
      setFolders(foldersResponse.data);
      setAttachments(attachmentsResponse.data);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.firstError()
          : 'Não foi possível carregar seus arquivos.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  function confirmDelete(attachment: ExamAttachment) {
    Alert.alert('Excluir exame', `Remover "${attachment.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          if (!token) {
            return;
          }
          try {
            await deleteExamAttachment(token, attachment.id);
            setAttachments((current) => current.filter((item) => item.id !== attachment.id));
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o exame. Tente novamente.');
          }
        },
      },
    ]);
  }

  const visibleAttachments = selectedFolderId
    ? attachments.filter((attachment) => attachment.folder_id === selectedFolderId)
    : attachments;
  const [firstFile, ...restFiles] = visibleAttachments;

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

          {folders.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-6">
              {folders.map((folder) => (
                <FolderChip
                  key={folder.id}
                  name={folder.name}
                  selected={selectedFolderId === folder.id}
                  onPress={() =>
                    setSelectedFolderId((current) => (current === folder.id ? null : folder.id))
                  }
                />
              ))}
            </ScrollView>
          )}

          {isLoading ? (
            <ActivityIndicator className="mt-8" color="#0A84FF" />
          ) : error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-center text-sm text-muted">
              {error}
            </Text>
          ) : visibleAttachments.length === 0 ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-center text-sm text-muted">
              Nenhum exame anexado ainda. Toque no + para adicionar o primeiro.
            </Text>
          ) : (
            <View className="gap-3">
              {firstFile ? (
                <ExamFileCard
                  key={firstFile.id}
                  name={firstFile.title}
                  date={firstFile.exam_date ?? ''}
                  type="image"
                  uri={firstFile.url}
                  token={token}
                  wide
                  onPress={() => confirmDelete(firstFile)}
                />
              ) : null}

              <View className="flex-row flex-wrap gap-3">
                {restFiles.map((attachment) => (
                  <ExamFileCard
                    key={attachment.id}
                    name={attachment.title}
                    date={attachment.exam_date ?? ''}
                    type="image"
                    uri={attachment.url}
                    token={token}
                    onPress={() => confirmDelete(attachment)}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Pressable
        onPress={() => router.push('/add-exam')}
        className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/30"
        style={{ bottom: BottomTabInset + 16 }}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#FFFFFF" size={24} />
      </Pressable>
    </View>
  );
}
