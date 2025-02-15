import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({ label, error, icon, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          props.editable === false ? styles.inputDisabled : null,
        ]}
      >
        {icon && <Ionicons name={icon} size={20} color="#6B7280" style={styles.icon} />}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    padding: 12,
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  icon: {
    marginLeft: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});