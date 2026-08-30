import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api';
import { sendChatMessage, type ChatMessage } from '@/services/chat';

type DisplayMessage = ChatMessage & { id: string };

function AssistantAvatar({ size }: { size: number }) {
  return (
    <Image
      source={require('@/assets/images/chat/assistant-avatar.png')}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      contentFit="cover"
    />
  );
}

export default function ChatScreen() {
  const { token } = useAuth();
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (text.length === 0 || !token || isSending) {
      return;
    }

    // Only prior turns go in `history` — the new message is sent separately,
    // and the backend injects the clinical-context system prompt itself.
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: 'user', content: text }]);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const response = await sendChatMessage(token, text, history);
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: 'assistant', content: response.data.content },
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.firstError()
          : 'Não foi possível falar com o assistente agora. Tente novamente.'
      );
    } finally {
      setIsSending(false);
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
            {/* Plain Text instead of SymbolView: the Material Symbols glyph SymbolView
                uses on Android/web renders blank for a frame while its font loads on
                every mount (see MaterialSymbols_400Regular preload note above) — this
                close button is the very first thing a user sees on entering the modal,
                so it can't afford that flash. */}
            <Text style={{ fontSize: 18, lineHeight: 20, color: theme.text }}>✕</Text>
          </Pressable>
          <View>
            <Text
              style={{ fontFamily: Fonts.extraBold }}
              className="text-2xl text-black dark:text-white">
              Assistente Guarde
            </Text>
            <Text style={{ fontFamily: Fonts.regular }} className="text-xs text-muted">
              Seu histórico entra automaticamente no contexto
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.select({ ios: 'padding', default: undefined })}
          keyboardVerticalOffset={Platform.select({ ios: 12, default: 0 })}>
          <ScrollView
            ref={scrollRef}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            contentContainerClassName="gap-3 p-4 pb-2"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {messages.length === 0 ? (
              <View className="items-center gap-2 rounded-3xl border border-hairline bg-surface p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <AssistantAvatar size={56} />
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-center text-sm text-black dark:text-white">
                  Converse sobre sua saúde
                </Text>
                <Text style={{ fontFamily: Fonts.regular }} className="text-center text-xs text-muted">
                  Suas alergias, condições e medicamentos entram automaticamente na conversa — isso
                  não substitui uma avaliação médica.
                </Text>
              </View>
            ) : (
              messages.map((message) =>
                message.role === 'assistant' ? (
                  <View key={message.id} className="max-w-[85%] flex-row items-end gap-2 self-start">
                    <AssistantAvatar size={28} />
                    <View className="flex-shrink rounded-3xl rounded-bl-md border border-hairline bg-surface px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                      <Text
                        style={{ fontFamily: Fonts.regular }}
                        className="text-sm text-black dark:text-white">
                        {message.content}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    key={message.id}
                    className="max-w-[85%] self-end rounded-3xl rounded-br-md bg-primary px-4 py-3">
                    <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-white">
                      {message.content}
                    </Text>
                  </View>
                )
              )
            )}

            {isSending ? (
              <View className="max-w-[85%] flex-row items-end gap-2 self-start">
                <AssistantAvatar size={28} />
                <View className="flex-row items-center gap-2 rounded-3xl rounded-bl-md border border-hairline bg-surface px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <ActivityIndicator size="small" color="#0A84FF" />
                  <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
                    Pensando...
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {error ? (
            <Text style={{ fontFamily: Fonts.regular }} className="px-4 pb-1 text-xs text-red-500">
              {error}
            </Text>
          ) : null}

          <View className="flex-row items-end gap-2 px-4 pb-2 pt-1">
            <View className="flex-1 flex-row items-center rounded-3xl border border-hairline bg-surface px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Escreva sua pergunta..."
                placeholderTextColor={theme.textSecondary}
                multiline
                style={{ fontFamily: Fonts.regular, maxHeight: 100 }}
                className="flex-1 text-base text-black dark:text-white"
              />
            </View>
            <Pressable
              onPress={handleSend}
              disabled={isSending || input.trim().length === 0}
              className={`h-11 w-11 items-center justify-center rounded-full ${
                isSending || input.trim().length === 0 ? 'bg-primary/40' : 'bg-primary'
              }`}>
              <SymbolView
                name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
                tintColor="#FFFFFF"
                size={18}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
