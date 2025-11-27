
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { colors, fonts } from '@/styles/commonStyles';
import CustomHeader from '@/components/CustomHeader';
import { supabase } from '@/app/integrations/supabase/client';

export default function MyAccountScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error checking user:', error);
      }
      
      console.log('Current user:', user);
      setUser(user);
    } catch (error) {
      console.error('Error in checkUser:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setActionLoading(true);
      
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        Alert.alert('Sign In Failed', error.message);
        return;
      }

      console.log('Sign in successful:', data.user);
      Alert.alert('Success', 'Signed in successfully!');
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Sign in exception:', error);
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setActionLoading(true);
      
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      console.log('Attempting to sign up with:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        Alert.alert('Sign Up Failed', error.message);
        return;
      }

      console.log('Sign up successful:', data);
      
      if (data.user && !data.session) {
        Alert.alert(
          'Verify Your Email',
          'Please check your email and click the verification link to complete registration.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Success', 'Account created successfully!');
        setUser(data.user);
      }
      
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Sign up exception:', error);
      Alert.alert('Error', error.message || 'Failed to sign up');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setActionLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        Alert.alert('Error', 'Failed to sign out');
        return;
      }

      console.log('Signed out successfully');
      Alert.alert('Success', 'Signed out successfully');
      setUser(null);
    } catch (error: any) {
      console.error('Sign out exception:', error);
      Alert.alert('Error', error.message || 'Failed to sign out');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader title="My Account" />
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <CustomHeader title="My Account" />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.userCard}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.userIdText}>User ID: {user.id}</Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>✅ You are logged in</Text>
              <Text style={styles.infoText}>
                Your financial data should now be loading from the database.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.signOutButton]}
              onPress={handleSignOut}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="My Account" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.authCard}>
          <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp 
              ? 'Create an account to save your financial data' 
              : 'Sign in to access your financial data'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!actionLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#666666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!actionLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={actionLoading}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : 'Don&apos;t have an account? Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.subtextGray,
    marginTop: 12,
  },
  authCard: {
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    padding: 24,
  },
  userCard: {
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.subtextGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.green,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.subtextGray,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(46, 255, 139, 0.15)',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.green,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.subtextGray,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.green,
  },
  signOutButton: {
    backgroundColor: colors.red,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.background,
  },
  switchButton: {
    marginTop: 16,
    padding: 8,
  },
  switchButtonText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.green,
    textAlign: 'center',
  },
});
