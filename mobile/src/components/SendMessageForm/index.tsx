import React, { useState } from 'react';

import {
  Alert,
  Keyboard,
  TextInput,
  View
} from 'react-native';
import { set } from 'react-native-reanimated';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState('')
  const [sedingMessage, setSedingMessage] = useState(false)

  async function handleMessageSubmit() {
    const messageFormatted = message.trim();
    
    if (messageFormatted.length > 0) {
      setSedingMessage(true)
      await api.post('/messages', { message: messageFormatted });

      setMessage('')
      Keyboard.dismiss();
      Alert.alert("Messagem enviada!")
      setSedingMessage(false)
    } else {
      Alert.alert("escreva uma messagem para enviar")
    }
  }

  return (
    <View style={styles.container} >
      <TextInput
        keyboardAppearance="dark"
        placeholder="Escreva sua mensagem"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        style={styles.input}
        editable={!sedingMessage}
      />

      <Button 
        title="Enviar Messagem"
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sedingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}