import {Pressable, StyleSheet, View} from 'react-native';

import {Card, Text} from 'react-native-paper';
import {FadeInImage} from '../components/FadeInImage';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {Pokemon} from '../../layers/entities/pokemon';
import {Formatter} from '../../layers/config/helpers/formatter';
import {RootStackParams} from '../navigator/StackNavigator';

interface Props {
  pokemon: Pokemon;
}

export const PokemonCard = ({pokemon}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  return (
    <Pressable
      style={{flex: 0.6, flexWrap: 'wrap'}}
      onPress={() =>
        navigation.navigate('PokemonScreen', {pokemonId: pokemon.id})
      }>
      <Card style={[styles.cardContainer, {backgroundColor: '#EFEFEF'}]}>
        <Text style={styles.number}>
          {/* {Formatter.capitalize(pokemon.name)} */}
          {'\n#' + pokemon.id}
        </Text>

        {/* POkemon Image */}
        <FadeInImage uri={pokemon.avatar} style={styles.pokemonImage} />

        {/* Types */}
        <View>
          <Text style={[styles.name]}>
            {Formatter.capitalize(pokemon.name)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    backgroundColor: 'grey',
    height: 140,
    width: 130,
    flex: 0.5,
    marginBottom: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  name: {
    color: 'black',
    fontSize: 18,
    right: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  number: {
    color: 'black',
    fontSize: 18,
    right: 10,
    textAlign: 'right',
  },
  pokeball: {
    width: 100,
    height: 100,
    right: -25,
    top: -25,
    opacity: 0.4,
  },
  pokemonImage: {
    width: 60,
    height: 60,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pokeballContainer: {
    alignItems: 'flex-end',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden',
    opacity: 0.5,
  },
});
