import React, {useState, useEffect} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Vamos precisar e importar o arquivo api.js que está na pasta services. Caso esse arquivo ainda não for criado, então precisamos criar a pasta "services" dentro da pasta "src" e depois criar o arquivo "api.js"
import api from './services/api';


export default function App() {
      // Criando dois projetos
  /* 'useState' retorna duas posições: 
  1. Variável com o seu valor inicial 
  2. Função para atualizarmos esse valor
  Logo, vamos utilizar o conceito e DESESTRUTUÇÃO
  Obs.: como "repositories" vai sempre ser uma array, é necessário também que useState([]) o seja e vazio
  Obs.: Se "repositories" fosse um objeto, então teriamos também useState({}).
  */
  const [repositories, setRepositories] = useState([]);

  // Aqui, vou colocar o useAffect(que recebe dois parâmetros) para listar/carregar os repositorios:
  // 1º parâmetro: qual função eu quero disparar?
  // 2º parâmetro: quando é que eu quero disparar essa função?
  // Se eu quissesse que essa função fosse disparada toda vez que a variável "repositoies" tivesse valor alterado, então fariamos "[repositories]". Mas eu quere que a função seja disparada a penas 1 vez. Logo adiciono o array vazio '[]'. chama-se array de dependências. Se tivermos alguma variável dentro de "{}", então toda vez que ocorrer alteração em '[]', a variável dentro de "{}" será executada. Neste caso temos.
  useEffect( () => {
    api.get('repositories').then(response => {
      // Quando api.get('repositories') retornar uma resposta "então" teremos resposta disponível dentro de "response"
      const repository = response.data;
      setRepositories(repository);
    } )
  }, [] );
  

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data;

    // Vou fazer a mesma coisa que fiz com o filter. Só que agora vou sobreescrever informação no estado ao invés de filtrar.
    const repositoriesUpdated = repositories.map(repository => {
      // Vou comparar agora se o id do repositorio que estou recebendo dentro do map é igual ao id do repositório que acabei de atualizar(o id que está em "handleLikeRepository")
      if(repository.id === id){
        return likedRepository;
      } else {
        return repository;
      }
    });

    setRepositories(repositoriesUpdated);
    // const repository = response.data;
    // setRepositories([...repositories, ])
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        {/* Agora vamos utilizar FlatList */}
        <FlatList
          // Qual é a variável que armazena os dados da nossa lista?R: "repositories". Logo:
          data = {repositories}
          //Vamos passar uma função "{}" para o "keyExtractor". Essa função recebe o "repository" que precisa retornar qual é a informação que é única nesse repositório(a informação única é o "repository.id").
          // Na verdade, o "keyExtractor" vai pegar cada item do array de "data" e vai passar pela função "repository" e precisa retornar qual que é a informação única no array de "data".
          keyExtractor = {repository => repository.id}
          // O "item" aqui representa cada um dos projetos
          renderItem = {({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}> {repository.title} </Text>
  
            <View style={styles.techsContainer}>
              {/* Adicionando map aqui */}
              {repository.techs.map(tech => (
                // Lembrando que cada vez que temos um "map" precisamos de uma key. Neste caso é a própria "tech". Isto porque não tem um reposítório ter "tech" repetidas
                <Text key={tech} style={styles.tech}>
                  {tech}
                </Text>
              ) )}
              <Text style={styles.tech}>
                Node.js
              </Text>

            </View>
  
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}. Serve para quando executarmos os textes para que consigamos encontrar "repository.id"
                testID={`repository-likes-${repository.id}`}
              >
                {/* Aqui, vamos colocar "{repositories.likes}" */}
                {repository.likes} curtidas
              </Text>
            </View>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)} /* Coloco qual repositório quero realizzar um like */
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${repository.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </View>
          )}
                    
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
