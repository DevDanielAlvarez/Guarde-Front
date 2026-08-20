import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FolderChip } from '@/components/folder-chip';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api';
import { createFolder, listFolders, uploadExamAttachment, type Folder } from '@/services/exams';
import { formatDateInput, isValidDateInput, toIsoDate } from '@/utils/date';

type PickedImage = { uri: string; fileName: string; mimeType: string };

export default function AddExamScreen() {
  const { token } = useAuth();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [title, setTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    listFolders(token)
      .then((response) => setFolders(response.data))
      .catch(() => {
        /* folder selector just stays empty — not fatal for uploading */
      });
  }, [token]);

  async function pickFrom(source: 'camera' | 'library') {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Habilite o acesso nas configurações pra continuar.');
      return;
    }

    const result = await (source === 'camera'
      ? ImagePicker.launchCameraAsync({ quality: 0.7, mediaTypes: ['images'] })
      : ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ['images'] }));

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setImage({
      uri: asset.uri,
      fileName: asset.fileName ?? `exame-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });
  }

  async function handleCreateFolder() {
    if (!token || newFolderName.trim().length === 0) {
      return;
    }
    setIsCreatingFolder(true);
    try {
      const response = await createFolder(token, newFolderName.trim());
      setFolders((current) => [...current, response.data]);
      setSelectedFolderId(response.data.id);
      setNewFolderName('');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a pasta. Tente novamente.');
    } finally {
      setIsCreatingFolder(false);
    }
  }

  async function handleSubmit() {
    if (!token || !image) {
      setError('Escolha uma foto pra continuar.');
      return;
    }
    if (title.trim().length === 0) {
      setError('Dê um título pro exame.');
      return;
    }
    if (examDate.length > 0 && !isValidDateInput(examDate)) {
      setError('Informe uma data válida.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await uploadExamAttachment(token, {
        uri: image.uri,
        fileName: image.fileName,
        mimeType: image.mimeType,
        title: title.trim(),
        examDate: examDate ? toIsoDate(examDate) : undefined,
        folderId: selectedFolderId,
      });
      router.back();
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError ? caughtError.firstError() : 'Não foi possível salvar o exame.'
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
            Novo exame
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="gap-4 p-4 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 24 }}
              contentFit="cover"
            />
          ) : null}

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => pickFrom('camera')}
              className="flex-1 items-center gap-2 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <SymbolView
                name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
                tintColor="#0A84FF"
                size={22}
              />
              <Text
                style={{ fontFamily: Fonts.semiBold }}
                className="text-xs text-black dark:text-white">
                Tirar foto
              </Text>
            </Pressable>
            <Pressable
              onPress={() => pickFrom('library')}
              className="flex-1 items-center gap-2 rounded-2xl border border-hairline bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <SymbolView
                name={{ ios: 'photo.fill', android: 'image', web: 'image' }}
                tintColor="#0A84FF"
                size={22}
              />
              <Text
                style={{ fontFamily: Fonts.semiBold }}
                className="text-xs text-black dark:text-white">
                Escolher da galeria
              </Text>
            </Pressable>
          </View>

          <FormField
            label="Título"
            icon={{ ios: 'text.document', android: 'description', web: 'description' }}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Raio-x do joelho"
          />

          <FormField
            label="Data do exame"
            icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            value={examDate}
            onChangeText={(text) => setExamDate(formatDateInput(text))}
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            maxLength={10}
          />

          <View className="gap-3">
            <Text style={{ fontFamily: Fonts.semiBold }} className="text-xs uppercase tracking-wide text-muted">
              Pasta (opcional)
            </Text>
            {folders.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
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
            ) : null}

            <FormField
              label="Nova pasta"
              icon={{ ios: 'folder.badge.plus', android: 'create_new_folder', web: 'create_new_folder' }}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Nome da pasta"
            />
            <PrimaryButton
              label={isCreatingFolder ? 'Criando pasta...' : 'Criar pasta'}
              onPress={handleCreateFolder}
              disabled={isCreatingFolder || newFolderName.trim().length === 0}
            />
          </View>

          {error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-red-500">
              {error}
            </Text>
          ) : null}

          <PrimaryButton
            label={isSubmitting ? 'Salvando...' : 'Salvar exame'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
