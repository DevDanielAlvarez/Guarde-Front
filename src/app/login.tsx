import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth-layout';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { useAuth } from '@/contexts/auth-context';
import { Fonts } from '@/constants/theme';
import { ApiError } from '@/services/api';

type FormErrors = {
  login?: string;
  password?: string;
};

export default function LoginScreen() {
  const { login: signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (login.trim().length === 0) {
      nextErrors.login = 'Informe seu CPF ou e-mail.';
    }
    if (password.length === 0) {
      nextErrors.password = 'Informe sua senha.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(login.trim(), password);
      router.replace('/');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ login: error.firstError() });
      } else {
        setErrors({ login: 'Não foi possível conectar ao servidor. Tente novamente.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      heroImage={require('@/assets/images/auth/login_bg.png')}
      navLabel="Entrar"
      title="Guarde"
      subtitle="Seu histórico de saúde, sempre com você">
      <View className="gap-4">
        <FormField
          label="CPF ou e-mail"
          icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
          value={login}
          onChangeText={setLogin}
          placeholder="CPF ou e-mail"
          autoCapitalize="none"
          textContentType="username"
          autoComplete="username"
          error={errors.login}
        />
        <FormField
          label="Senha"
          icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureToggle
          autoCapitalize="none"
          textContentType="password"
          autoComplete="password"
          error={errors.password}
        />
      </View>

      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className="-mt-2 text-right text-xs text-primary">
        Esqueci minha senha
      </Text>

      <View className="gap-4">
        <PrimaryButton
          label={isSubmitting ? 'Entrando...' : 'Entrar'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
        <View className="flex-row justify-center gap-1">
          <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
            Não tem uma conta?
          </Text>
          <Link href="/register">
            <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-primary">
              Cadastre-se
            </Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}
