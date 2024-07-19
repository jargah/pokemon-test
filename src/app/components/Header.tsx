import React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';

const Header = () => {
  return (
    <Appbar.Header mode="medium">
      <Appbar.Content
        title="Pokemon"
        color="#FFFFFF"
        titleStyle={style.title}
      />
    </Appbar.Header>
  );
};

const style = StyleSheet.create({
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Header;
