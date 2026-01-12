import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './theme/ThemeContext';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './screens/MainTabNavigator';
import AddTaskScreen from './screens/AddTaskScreen';
import EditTask from './screens/EditTask';
import EditProfile from './screens/EditProfile';
import AccountSettings from './screens/AccountSettings';
import PrivacySettings from './screens/PrivacySettings';
import NotificationSettings from './screens/NotificationSettings';
import HelpScreen from './screens/HelpScreen';
import StorageSettings from './screens/StorageSettings';
import AccessibilitySettings from './screens/AccessibilitySettings';
import InviteFriends from './screens/InviteFriends';
import TermsScreen from './screens/TermsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyResetCodeScreen from './screens/VerifyResetCodeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [initialRoute, setInitialRoute] = React.useState('Welcome');
  const navigationRef = React.useRef(null);

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  React.useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setInitialRoute('Main');
      } else {
        setInitialRoute('Welcome');
      }
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && navigationRef.current) {
        navigationRef.current.navigate('ResetPassword');
        return;
      }
      setInitialRoute(session ? 'Main' : 'Welcome');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditTask" component={EditTask} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacySettings" component={PrivacySettings} options={{ headerShown: false }} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ headerShown: false }} />
            <Stack.Screen name="HelpScreen" component={HelpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="StorageSettings" component={StorageSettings} options={{ headerShown: false }} />
            <Stack.Screen name="AccessibilitySettings" component={AccessibilitySettings} options={{ headerShown: false }} />
            <Stack.Screen name="InviteFriends" component={InviteFriends} options={{ headerShown: false }} />
            <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
