import {StyleSheet, View} from 'react-native';
import {TextInput, ActivityIndicator} from 'react-native-paper';
import {
  getPokemonNamesWithId,
  getPokemons,
  getPokemonsByIds,
} from '../../../layers/actions/pokemons';

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {PokeballBg} from '../../components/PokeballBg';
import {FlatList} from 'react-native-gesture-handler';
import {globalTheme} from '../../../layers/config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigator/StackNavigator';
import {FullScreenLoader} from '../../components/FullScreenLoader';
import Header from '../../components/Header';
import {useMemo, useState} from 'react';
import {useDebouncedValue} from '../../hooks/useDebouncedValue';
import {PokemonCard} from '../../components/PokemonCard';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({}: Props) => {
  const {top} = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [term, setTerm] = useState('');

  const debouncedValue = useDebouncedValue(term);

  const {data: pokemonNameList = []} = useQuery({
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

    if (debouncedValue.length === 0) {
      return [];
    }
    if (debouncedValue.length < 3) {
      return [];
    }

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLocaleLowerCase()),
    );
  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const {
    isLoading: isLoadingData,
    data,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 60 minutes
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });

      return pokemons;
    },
    getNextPageParam: (lastPage, pages) => pages.length,
  });

  if (isLoadingData) {
    return <FullScreenLoader />;
  }

  console.log('pokemons => ', pokemons);

  return (
    <View style={globalTheme.body}>
      <Header />

      <View style={{paddingLeft: 20, paddingRight: 20}}>
        <TextInput
          style={{
            backgroundColor: '#FFFFFF',
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 20,
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
      </View>
      <View
        style={[
          globalTheme.globalMargin,
          {backgroundColor: '#FFFFFF', marginTop: top + 20, borderRadius: 10},
        ]}>
        <PokeballBg style={styles.imgPosition} />

        {isLoadingPokemons ? (
          <ActivityIndicator style={{paddingTop: 20, paddingBottom: 20}} />
        ) : (
          <FlatList
            data={pokemons.length > 0 ? pokemons : data?.pages.flat()}
            keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
            numColumns={3}
            style={{paddingTop: top + 20}}
            renderItem={({item}) => <PokemonCard pokemon={item} />}
            onEndReachedThreshold={0.6}
            onEndReached={() => fetchNextPage()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
});
