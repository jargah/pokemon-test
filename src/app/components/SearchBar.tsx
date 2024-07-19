import React, {useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {useDebouncedValue} from '../hooks/useDebouncedValue';
import {useQuery} from '@tanstack/react-query';

import {FullScreenLoader} from './FullScreenLoader';

import {PokeballBg} from './PokeballBg';
import {TextInput} from 'react-native-paper';
import {
  getPokemonNamesWithId,
  getPokemonsByIds,
} from '../../layers/actions/pokemons';

const SearchBar = () => {
  const [term, setTerm] = useState('');

  const debouncedValue = useDebouncedValue(term);

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  // Todo: aplicar debounce
  const pokemonNameIdList = useMemo(() => {
    // Es un número
    if (!isNaN(Number(debouncedValue))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(debouncedValue),
      );
      return pokemon ? [pokemon] : [];
    }

    if (debouncedValue.length === 0) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLocaleLowerCase()),
    );
  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={{paddingLeft: 20, paddingRight: 20}}>
      <TextInput
        style={{
          backgroundColor: '#FFFFFF',
          paddingLeft: 20,
          paddingRight: 20,
        }}
        theme={{
          roundness: 25,
        }}
        placeholder="Buscar Pokémon"
        mode="outlined"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
        underlineColorAndroid="transparent"
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}

      <PokeballBg style={style.pokeballBg} />
    </View>
  );
};

const style = StyleSheet.create({
  pokeballBg: {
    position: 'absolute',
    bottom: -50,
    left: -100,
    opacity: 0.5,
    width: 300,
    height: 300,
    zIndex: -1,
  },
});

export default SearchBar;
