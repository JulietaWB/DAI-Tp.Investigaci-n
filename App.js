import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Switch, Vibration, Keyboard, Platform } from 'react-native';

export default function App() {
  const [durationMs, setDurationMs] = useState('500');
  const [patternText, setPatternText] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const parsedDuration = useMemo(() => {
    const n = parseInt(durationMs, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [durationMs]);

  const parsedPattern = useMemo(() => {
    if (!patternText.trim()) return [];
    const nums = patternText
      .split(/[ ,]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n) && n >= 0);
    return nums;
  }, [patternText]);

  function handleVibrate() {
    setErrorMessage('');
    Keyboard.dismiss();

    try {
      if (parsedPattern.length > 0) {
        // Pattern mode: [wait, vibrate, wait, vibrate, ...]
        Vibration.vibrate(parsedPattern, repeat);
      } else {
        if (parsedDuration <= 0) {
          setErrorMessage('Ingrese un tiempo válido (> 0 ms) o un patrón.');
          return;
        }
        Vibration.vibrate(parsedDuration);
      }
    } catch (e) {
      setErrorMessage('No se pudo iniciar la vibración.');
    }
  }

  function handleCancel() {
    Vibration.cancel();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de Vibración</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Tiempo (ms)</Text>
        <TextInput
          value={durationMs}
          onChangeText={setDurationMs}
          keyboardType="numeric"
          placeholder="500"
          style={styles.input}
          inputMode="numeric"
          returnKeyType="done"
        />
        <Text style={styles.helper}>Si se define un patrón, el tiempo se ignora.</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Patrón (ms, separado por comas o espacios)</Text>
        <TextInput
          value={patternText}
          onChangeText={setPatternText}
          placeholder="100, 200, 300, 400"
          style={[styles.input, styles.inputMono]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
        <View style={styles.row}>
          <Text style={styles.switchLabel}>Repetir</Text>
          <Switch value={repeat} onValueChange={setRepeat} />
        </View>
        <Text style={styles.helper}>
          Formato: [espera, vibra, espera, vibra, ...]. Ejemplo: 0, 300, 200, 300
        </Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.actions}>
        <View style={styles.button}>
          <Button title="Vibrar" onPress={handleVibrate} />
        </View>
        <View style={styles.button}>
          <Button title="Cancelar" color={Platform.OS === 'ios' ? '#d00' : undefined} onPress={handleCancel} />
        </View>
      </View>

      <Text style={styles.helper}>
        Patrón personalizado: Si se escriben números separados por comas o espacios, se interpreta como un arreglo de milisegundos con el formato: [espera, vibra, espera, vibra, ...]

        El primer número es cuánto tiempo esperar antes de vibrar, el segundo cuánto vibrar, y así sucesivamente, alternando.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  block: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputMono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  helper: {
    marginTop: 8,
    color: '#666',
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
  error: {
    color: '#b00020',
    marginBottom: 8,
  },
});
