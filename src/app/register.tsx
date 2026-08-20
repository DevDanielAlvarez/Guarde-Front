import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth-layout';
import { FormField } from '@/components/form-field';
import { PrimaryButton } from '@/components/primary-button';
import { Fonts } from '@/constants/theme';
import { formatCpf, isValidCpfFormat } from '@/utils/cpf';

type FormErrors = {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (name.trim().length < 3) {
      nextErrors.name = 'Informe seu nome completo.';
    }
    if (!isValidCpfFormat(cpf)) {
      nextErrors.cpf = 'Informe um CPF válido.';
    }
    if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = 'Informe um e-mail válido.';
    }
    if (password.length < 6) {
      nextErrors.password = 'A senha deve ter ao menos 6 caracteres.';
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'As senhas não coincidem.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      router.replace('/login');
    }
  }

  return (
    <AuthLayout
      heroImage={require('@/assets/images/auth/login_bg.png')}
      navLabel="Criar conta"
      title="Guarde"
      subtitle="Centralize seus dados clínicos com segurança">
      <View className="gap-4">
        <FormField
          label="Nome completo"
          icon={{ ios: 'person', android: 'person', web: 'person' }}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
          error={errors.name}
        />
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
          label="E-mail"
          icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          autoComplete="email"
          error={errors.email}
        />
        <FormField
          label="Senha"
          icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          value={password}
          onChangeText={setPassword}
          placeholder="Crie uma senha"
          secureToggle
          autoCapitalize="none"
          textContentType="newPassword"
          error={errors.password}
        />
        <FormField
          label="Confirmar senha"
          icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repita a senha"
          secureToggle
          autoCapitalize="none"
          textContentType="newPassword"
          error={errors.confirmPassword}
        />
      </View>

      <View className="gap-4">
        <PrimaryButton label="Cadastrar" onPress={handleSubmit} />
        <View className="flex-row justify-center gap-1">
          <Text style={{ fontFamily: Fonts.regular }} className="text-sm text-muted">
            Já tem uma conta?
          </Text>
          <Link href="/login">
            <Text style={{ fontFamily: Fonts.semiBold }} className="text-sm text-primary">
              Entrar
            </Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}
