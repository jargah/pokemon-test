import {pokeApi} from '../../config/api/pokeApi';
import {Pokemon} from '../../entities/pokemon';
import {PokeAPIPokemon} from '../../interfaces/pokepi.interfaces';
import {PokemonMapper} from '../../mappers/pokemon.mapper';

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  try {
    const {data} = await pokeApi.get<PokeAPIPokemon>(`/pokemon/${id}`);

    console.log('DATA =>', data);

    const pokemon = await PokemonMapper.pokeApiPokemonToEntity(data);

    return pokemon;
  } catch (error) {
    throw new Error(`Error getting pokemon by id: ${id}`);
  }
};
