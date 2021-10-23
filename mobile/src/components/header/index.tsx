import React from 'react';
import * as Svg from 'react-native-svg';

import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { styles } from './styles';

import { UserPhoto } from '../userPhoto/index'
import LogoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

export function Header(){
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <LogoImg />

      <View style={styles.logOutButton} >
        {user && 
          <TouchableOpacity onPress={signOut} >
            <Text style={styles.logOutText} >Sair</Text>
          </TouchableOpacity>
        }

        <UserPhoto imageUri={user?.avatar_url} />
      </View>
    </View>
  );
}