import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';

export default function TermsScreen() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.body, { color: colors.textPrimary }]}>
TERMOS DE USO – APLICATIVO STUDIA{"\n"}
Última atualização: 30 de setembro de 2025{"\n"}
1. Aceitação dos Termos{"\n"}
Ao acessar ou utilizar o Studia, o usuário declara que leu, entendeu e concorda em se
submeter integralmente às condições aqui descritas. Caso não concorde, deverá
interromper imediatamente o uso do aplicativo.{"\n"}
2. Objetivo do Aplicativo{"\n"}
O Studia tem como finalidade auxiliar estudantes a organizar suas atividades acadêmicas,
permitindo: Criação, edição e exclusão de tarefas; Organização por matéria, sala e
professor; Definição de prazos de entrega; Marcação de atividades concluídas;
Visualização intuitiva das atividades com base em cores e categorias.{"\n"}
3. Cadastro e Acesso{"\n"}
O uso do Studia pode exigir a criação de uma conta vinculada ao Supabase (plataforma
de autenticação e banco de dados). O usuário se compromete a fornecer informações
verdadeiras, completas e atualizadas no momento do cadastro. O usuário é responsável
por manter a confidencialidade de suas credenciais de acesso.{"\n"}
4. Direitos e Responsabilidades do Usuário{"\n"}
Utilizar o Studia apenas para fins pessoais e educacionais. Não usar o aplicativo para fins
ilícitos, fraudulentos ou que possam prejudicar terceiros. Não tentar violar, modificar ou
explorar vulnerabilidades do sistema. Manter suas informações atualizadas e corretas.{"\n"}
5. Direitos e Responsabilidades do Desenvolvedor{"\n"}
Disponibilizar o aplicativo em conformidade com suas funcionalidades descritas.
Empenhar esforços para corrigir falhas técnicas e manter a segurança das informações.
O desenvolvedor não se responsabiliza por perdas, danos ou prejuízos decorrentes do
uso inadequado do aplicativo ou de falhas externas (como indisponibilidade de internet ou
do Supabase).{"\n"}
6. Propriedade Intelectual{"\n"}
Todo o conteúdo do Studia (logotipo, design, código-fonte e funcionalidades) é de
propriedade do time de desenvolvimento do Projeto Integrador. É vedada a reprodução,
distribuição ou modificação do aplicativo sem autorização expressa.{"\n"}
7. Coleta e Tratamento de Dados{"\n"}
O Studia coleta informações fornecidas pelo usuário (como nome, e-mail e tarefas
cadastradas). Esses dados são armazenados com segurança no Supabase e utilizados
exclusivamente para o funcionamento do aplicativo. O uso detalhado dos dados está
descrito na Política de Privacidade.{"\n"}
8. Modificações dos Termos{"\n"}
Os Termos de Uso podem ser alterados a qualquer momento para se adequar a novas
funcionalidades, exigências legais ou melhorias no aplicativo. O usuário será notificado
em caso de mudanças relevantes.{"\n"}
9. Penalidades{"\n"}
O descumprimento dos presentes Termos poderá resultar em advertência, suspensão ou
exclusão da conta do usuário, a critério do desenvolvedor.{"\n"}
10. Legislação Aplicável{"\n"}
Este documento é regido pelas leis brasileiras. Quaisquer conflitos oriundos da utilização
do Studia deverão ser resolvidos no foro da comarca do usuário.{"\n"}
11. Contato{"\n"}
Em caso de dúvidas, sugestões ou solicitações referentes a estes Termos de Uso, o
usuário poderá entrar em contato através do e-mail: suporte@studia.app
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


