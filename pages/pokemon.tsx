
import { FlatList, Text, View, ActivityIndicator, StyleSheet, Image, TextInput } from 'react-native'

import React, { useEffect, useState } from 'react'

interface Gato {
  id: string
  url: string
  width: number
  height: number
  breeds: {
    name: string
  }[]
}

const pokemon = () => {

  const [Gato, setGato] = useState<Gato[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [pesquisa, setPesquisa] = useState<string>('')

  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "DEMO-API-KEY"
  })

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: headers
  }

  useEffect(() => {

    fetch(
      "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10",
      requestOptions
    )
      .then(response => response.json())
      .then((dados: Gato[]) => {
        setGato(dados)
      })
      .catch(error => console.log('error', error))
      .finally(() => setCarregando(false))

  }, [])

  if (carregando) {
    return <ActivityIndicator size="large" />
  }

  const gatosFiltrados = Gato.filter((item) =>
    item.breeds.some((raca) =>
      raca.name.toLowerCase().includes(pesquisa.toLowerCase())
    )
  )

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar gato..."
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <FlatList
        data={gatosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Image
              source={{ uri: item.url }}
              style={styles.imagem}
            />

            <Text style={styles.texto}>
              {item.breeds.length > 0
                ? item.breeds[0].name
                : 'Raça desconhecida'}
            </Text>

            <Text>Altura: {item.height}</Text>

            <Text>Largura: {item.width}</Text>

          </View>
        )}
      />

    </View>
  )
}

export default pokemon

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 50,
    marginTop: 50,
    marginBottom: 10
  },

  card: {
    alignItems: 'center',
    marginBottom: 20
  },

  imagem: {
    width: 300,
    height: 250,
    resizeMode: 'contain'
  },

  texto: {
    fontSize: 18,
    fontWeight: 'bold'
  }

})
