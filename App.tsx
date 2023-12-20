import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, Platform, StyleSheet, View } from 'react-native';
import BingImageCreator, { BingImageCreatorRef } from 'react-native-bing-image-creator';

export default function App() {
  const refBingImageCreator = React.useRef<BingImageCreatorRef>(null);

  const [images, setImages] = React.useState<string[]>();

  const getTextInput = async (): Promise<string> => {
    return new Promise((resolve) => {
      if (Platform.OS == 'ios') {
        Alert.prompt('Search', 'Type something', [{ text: 'OK', onPress: (value) => resolve(`${value}`) }], 'plain-text');
      } else {
        resolve('Hello World');
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <BingImageCreator ref={refBingImageCreator} />

      <Button
        onPress={async () => {
          const login = await refBingImageCreator.current?.loginBingMicrosoft();
          Alert.alert('Login: ', JSON.stringify(login));
        }}
        title="Login"
      />

      <Button
        onPress={async () => {
          const logout = await refBingImageCreator.current?.logoutBingMicrosoft();
          Alert.alert('Logout: ', JSON.stringify(logout));
        }}
        title="Logout"
      />

      <Button
        onPress={async () => {
          const search = await getTextInput();
          if (search) {
            const data = await refBingImageCreator.current?.getImages(`${search}`);
            Alert.alert('Search: ', JSON.stringify(data));
            if (data?.images && data?.images.length > 0) {
              setImages(data?.images);
            }
          }
        }}
        title="Create images"
      />

      {images && images.map((image) => <Image key={image} source={{ uri: image }} style={{ width: 100, height: 100 }} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
