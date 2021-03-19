import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text} from 'react-native';

import SplashScene from './SplashScreen';
import LoginScene from './LoginScene';


const WelcomeScene = () => {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        setTimeout(() =>{
            setIsVisible(false);
        }, 1000); 
    }, []);
    return (
        <View>
            {isVisible ? <SplashScene /> : <LoginScene />} 
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
  

  export default WelcomeScene;