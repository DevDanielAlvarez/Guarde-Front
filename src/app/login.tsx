import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth-layout';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { formatCpf, isValidCpfFormat } from '@/utils/cpf';

type FormErrors = {
  cpf?: string;
  password?: string;
};

export default function LoginScreen() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (!isValidCpfFormat(cpf)) {
      nextErrors.cpf = 'Informe um CPF válido.';
    }
    if (password.length === 0) {
      nextErrors.password = 'Informe sua senha.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      router.replace('/');
    }
  }

  return (
    <AuthLayout
      heroImage={require('@/assets/images/auth/login_bg.jpg')}
      navLabel="Entrar"
      title="Guarde"
      subtitle="Seu histórico de saúde, sempre com você">
      <View className="gap-4">
        <FormField
          label="CPF"
          icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          maxLength={14}
          error={errors.cpf}
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

      <Text className="-mt-2 text-right text-xs font-semibold text-primary">
        Esqueci minha senha
      </Text>

      <View className="gap-4">
        <PrimaryButton label="Entrar" onPress={handleSubmit} />
        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-muted">Não tem uma conta?</Text>
          <Link href="/register">
            <Text className="text-sm font-semibold text-primary">Cadastre-se</Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}
