import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Política de Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.body, { color: colors.textPrimary }]}>
Política de Privacidade – Aplicativo STUDIA{"\n"}
Última atualização: 30/09/2025{"\n"}
1. Informações Coletadas{"\n"}
Ao utilizar o aplicativo STUDIA, poderemos coletar os seguintes dados:{"\n"}
- Dados de cadastro: nome, e-mail, senha de acesso.{"\n"}
- Dados acadêmicos: atividades, matérias, professores, salas e datas de entrega cadastradas pelo
usuário.{"\n"}
- Dados de uso: informações sobre como o usuário interage com o aplicativo (funcionalidades
acessadas, frequência de uso, preferências).{"\n"}
2. Finalidade da Coleta{"\n"}
Os dados coletados são utilizados para:{"\n"}
- Permitir o cadastro, autenticação e uso do aplicativo.{"\n"}
- Organizar e exibir atividades escolares de forma personalizada.{"\n"}
- Melhorar a experiência do usuário por meio de ajustes e atualizações.{"\n"}
- Garantir segurança, prevenir fraudes e cumprir obrigações legais.{"\n"}
3. Armazenamento e Segurança{"\n"}
- Os dados são armazenados em servidores seguros, com medidas técnicas e organizacionais
adequadas.{"\n"}
- Utilizamos criptografia e autenticação segura para proteger informações de acesso.{"\n"}
- Os dados serão mantidos somente pelo período necessário ao cumprimento das finalidades
descritas nesta política.{"\n"}
4. Compartilhamento de Informações{"\n"}
O aplicativo não compartilha dados pessoais com terceiros para fins comerciais.{"\n"}
O compartilhamento poderá ocorrer apenas nos seguintes casos:{"\n"}
- Quando exigido por lei ou decisão judicial.{"\n"}
- Para prestação de serviços técnicos essenciais (como provedores de hospedagem).{"\n"}
5. Direitos do Usuário{"\n"}
De acordo com a LGPD, o usuário tem direito a:{"\n"}
- Confirmar a existência de tratamento de seus dados.{"\n"}
- Solicitar acesso, correção ou exclusão de suas informações pessoais.{"\n"}
- Solicitar a portabilidade de dados a outro fornecedor de serviço.{"\n"}
- Revogar o consentimento, a qualquer momento, mediante solicitação.{"\n"}
As solicitações podem ser feitas pelo e-mail oficial da equipe: suporte@studia.app{"\n"}
6. Uso por Menores de Idade{"\n"}
O aplicativo STUDIA pode ser utilizado por estudantes menores de 18 anos, sendo
responsabilidade dos pais ou responsáveis supervisionar o uso.{"\n"}
7. Alterações na Política de Privacidade{"\n"}
Reservamo-nos o direito de alterar esta Política de Privacidade a qualquer momento.
As mudanças serão comunicadas dentro do próprio aplicativo e terão validade a partir da data de
publicação.{"\n"}
8. Contato{"\n"}
Para dúvidas, sugestões ou solicitações relacionadas à privacidade, entre em contato:{"\n"}
E-mail: suporte@studia.app{"\n"}
Ao utilizar o aplicativo STUDIA, o usuário concorda com os termos desta Política de Privacidade.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  content: { padding: 20, paddingTop: 0 },
  body: { fontSize: 14, lineHeight: 22, fontFamily: 'Poppins-Regular' },
});


