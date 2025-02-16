// components/PaymentComponent.tsx
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

const PaymentComponent = ({ onSuccess, onCancel, amount }) => {
  const handlePayment = () => {
    // Simulate a successful payment process
    const paymentDetails = {
      transactionId: 'TXN123456',
      amount: amount,
      status: 'success',
    };
    Alert.alert(
      "Payment Confirmation",
      `Your payment of $${amount} was successful!`,
      [
        {
          text: "OK",
          onPress: () => onSuccess(paymentDetails), // Call onSuccess with payment details
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Payment Details
      </Text>
      <Text>Amount: ${amount}</Text>
      <Button title="Pay Now" onPress={handlePayment} />
      <Button title="Cancel" onPress={onCancel} color="red" />
    </View>
  );
};

export default PaymentComponent;
