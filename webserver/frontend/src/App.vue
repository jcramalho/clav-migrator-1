<template>
  <v-app>
    <v-app-bar app color="#1a237e" dark>
      <div class="d-flex align-center">
        <v-title class="title">CLAV - Classificação e Avaliação da Informação Pública</v-title>
      </div>
    </v-app-bar>

    <v-main>
      <Uploader />
    </v-main>
  </v-app>
</template>

<script>
import Uploader from "./components/Uploader";

export default {
  name: "App",

  components: {
    Uploader
  },

  data: () => ({
    //
  })
};
</script>
