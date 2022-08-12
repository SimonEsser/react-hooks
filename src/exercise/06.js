// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this:
  // return 'TODO'

  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const {pokemon, error, status} = state

  const isIdle = status === 'idle'
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isRejected = status === 'rejected'

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState(state => ({...state, status: 'pending'}))
    const fetch = async () => {
      try {
        const pokemonData = await fetchPokemon(pokemonName)
        setState(state => ({
          ...state,
          status: 'resolved',
          pokemon: pokemonData,
        }))
      } catch (err) {
        setState(state => ({
          ...state,
          status: 'rejected',
          error: err,
        }))
      }
    }

    fetch()
  }, [pokemonName])

  if (isRejected) {
    // will be handled by ErrorBoundary
    throw error
  }

  return (
    <>
      {isIdle && 'Submit a Pokemon'}
      {isPending && <PokemonInfoFallback name={pokemonName} />}
      {isResolved && <PokemonDataView pokemon={pokemon} />}
    </>
  )
}

class ErrorBoundary extends React.Component {
  state = {error: null}

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state
    if (error) {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
