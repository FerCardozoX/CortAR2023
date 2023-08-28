import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


export function CustomHeader() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginTop: 40 }}>
      <Text style={{ fontSize: 25, fontWeight: 'bold' }}>CortAR</Text>
      <TouchableOpacity>
        <AntDesign name="search1" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}
