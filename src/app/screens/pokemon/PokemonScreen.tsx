import {StackScreenProps} from '@react-navigation/stack';
import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import {RootStackParams} from '../../navigator/StackNavigator';
import {useQuery} from '@tanstack/react-query';
import {getPokemonById} from '../../../layers/actions/pokemons';
import {FullScreenLoader} from '../../components/FullScreenLoader';
import {Chip, Text} from 'react-native-paper';
import {Formatter} from '../../../layers/config/helpers/formatter';
import {FadeInImage} from '../../components/FadeInImage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useContext} from 'react';
import {ThemeContext} from '../../context/ThemeContext';
import * as Progress from 'react-native-progress';

interface Props extends StackScreenProps<RootStackParams, 'PokemonScreen'> {}

export const PokemonScreen = ({route}: Props) => {
  const {isDark} = useContext(ThemeContext);
  const {top} = useSafeAreaInsets();
  const {pokemonId} = route.params;

  const pokeballImg = isDark
    ? require('../../../assets/pokeball-light.png')
    : require('../../../assets/pokeball-dark.png');

  const {data: pokemon} = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => getPokemonById(pokemonId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (!pokemon) {
    return <FullScreenLoader />;
  }

  console.log(pokemon);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#FFFFFF'}}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      {/* Header Container */}
      <View style={[styles.headerContainer, {backgroundColor: pokemon.color}]}>
        {/* Nombre del Pokemon */}
        <Text
          style={{
            ...styles.pokemonName,
            top: top + 5,
          }}>
          {Formatter.capitalize(pokemon.name) + '\n'}#{pokemon.id}
        </Text>

        {/* Pokeball */}
        <Image source={pokeballImg} style={[styles.pokeball]} />

        <FadeInImage uri={pokemon.avatar} style={styles.pokemonImage} />
      </View>

      <View style={{margin: 40}} />

      {/* Types */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          marginTop: 10,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        {pokemon.types.map(type => (
          <Chip key={type} mode="outlined" selectedColor={pokemon.color}>
            {type}
          </Chip>
        ))}
      </View>

      {/* abilities */}
      <View style={{margin: 20, alignItems: 'center'}}>
        <Text style={[styles.subTitle, {color: pokemon.color}]}>About</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 0,
          marginTop: 10,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.itemAbout}>
          <Text style={{color: pokemon.color}}>{pokemon.height} m</Text>
          <Text style={{color: pokemon.color}}>Height</Text>
        </View>
        <View style={styles.itemAbout}>
          <Text style={{color: pokemon.color}}>{pokemon.weight} kg</Text>
          <Text style={{color: pokemon.color}}>Weight</Text>
        </View>

        <FlatList
          style={styles.itemAbout}
          data={pokemon.abilities}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Chip selectedColor={pokemon.color}>
              {Formatter.capitalize(item)}
            </Chip>
          )}
        />
      </View>

      {/* Stats */}
      <View style={{margin: 20, alignItems: 'center'}}>
        <Text style={[styles.subTitle, {color: pokemon.color}]}>
          Base Stats
        </Text>
      </View>

      <FlatList
        data={pokemon.stats}
        keyExtractor={item => item.name}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.statsContainer}>
            <View style={styles.item}>
              <Text style={{flex: 1, color: pokemon.color}}>
                {Formatter.capitalize(item.name)}
              </Text>
            </View>
            <View style={styles.itemBar}>
              <Text style={{paddingRight: 10, color: pokemon.color}}>
                {item.value}
              </Text>
              <Progress.Bar
                progress={item.value / 100}
                width={200}
                color={pokemon.color}
              />
            </View>
          </View>
        )}
      />

      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
    zIndex: 999,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pokemonName: {
    color: 'white',
    fontSize: 40,
    alignSelf: 'flex-start',
    left: 20,
  },
  pokeball: {
    width: 250,
    height: 250,
    bottom: -20,
    opacity: 0.7,
  },
  pokemonImage: {
    width: 240,
    height: 240,
    position: 'absolute',
    bottom: -40,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginHorizontal: 20,
  },
  item: {
    width: '30%',
  },
  itemBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  containerAbout: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemAbout: {
    paddingLeft: 40,
    paddingRight: 20,
    width: '33.33%',
  },
});
