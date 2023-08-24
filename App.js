import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground 
} from 'react-native';
import { Audio } from 'expo-av';
import { Button } from 'react-native';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';

export default function App() {
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (sound === null) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/music.mp3'),
          { shouldPlay: true }
        );
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = value => {
    setVolume(value);
    if (sound !== null) { // Check if the sound has been loaded
      if (value > 0) {
        sound.setVolumeAsync(value.toFixed(1)); // Set the volume of the sound
      } else {
        sound.setIsMutedAsync(true); // Mute the sound if the volume is 0
      }
    }
  };

  const buttonTitle = isPlaying ? '冷却中...' : '冷却開始';

  return (
    <ImageBackground source={require('./assets/bgImage.png')} style={styles.background}>
      <SafeAreaView style={styles.area_container}>
        <ScrollView style={styles.scrollView}>
          <View style={{height: 630}}></View>
          <View style={styles.content}>
            <TouchableOpacity
            style={styles.button} onPress={playSound}>
              <View style={styles.fixToText}>
                <Text style={styles.text}>{buttonTitle}</Text>
              </View>
            </TouchableOpacity>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              minimumValue={0.1}
              maximumValue={1}
              step={0.1}
              minimumTrackTintColor="#afaba5"
              thumbTintColor="#ffffff"
              trackHeight={8}  
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  area_container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'flex-end', // Align items to the bottom
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  content: {
    flex: 1, // Add flex of 1
    justifyContent: 'flex-end', // Align items to the bottom
  },  
  button: {
    alignItems: 'center',
    backgroundColor: '#afaba5',
    height: 70,
    borderRadius: 40,
    marginBottom: 10,
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800'
  },
  fixToText: {
    flexDirection: 'row',
  }
});
