import React, { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ onPress, title, variant = 'primary', style }, ref) => {
    if (variant === 'primary') {
      return (
        <TouchableOpacity ref={ref} onPress={onPress} style={[styles.buttonContainer, style]}>
          <LinearGradient
            colors={['#4C6FFF', '#6B4CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    if (variant === 'secondary') {
      return (
        <TouchableOpacity
          ref={ref}
          onPress={onPress}
          style={[styles.buttonContainer, styles.secondaryButton, style]}
        >
          <Text style={styles.secondaryButtonText}>{title}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        style={[styles.buttonContainer, styles.outlineButton, style]}
      >
        <Text style={styles.outlineButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E8EDFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4C6FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4C6FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#4C6FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

Button.displayName = "Button";