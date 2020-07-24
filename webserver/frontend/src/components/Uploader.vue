<template>
  <v-container>
    <v-row class="text-center">
      <v-file-input show-size v-model="file" @change="handleFileUpload()" label="File input"></v-file-input>

      <v-btn @click="postFile">Send</v-btn>
      <v-container v-if="loading" style="height: 400px;">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="subtitle-1 text-center" cols="12">A migrar ...</v-col>
          <v-col cols="6">
            <v-progress-linear color="#1a237e" indeterminate rounded height="6"></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
      <v-col v-if="toDownload" cols="12">
        <v-btn class="mb-2" @click="downloadFile">Download</v-btn>
        <v-card>
          <v-tabs v-model="tabs" centered>
            <v-tab>Base</v-tab>
            <v-tab>Classes</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card flat>
                <v-list-item v-for="(parseErr, index) in base.parsing" :key="index">
                  <v-list-item-content>
                    <v-list-item-title v-text="parseErr"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-expansion-panels>
                  <v-expansion-panel v-for="(inv,i) in invs" :key="i">
                    <v-expansion-panel-header disable-icon-rotate>
                      <span>
                        {{ inv.name }}
                        <v-chip
                          v-if="classes[inv.type][inv.code].length"
                          class="ma-2"
                          small
                          color="error"
                        >{{classes[inv.type][inv.code].length}}</v-chip>
                      </span>
                      <template v-slot:actions>
                        <v-icon
                          v-if="classes[inv.type][inv.code].length"
                          color="error"
                        >mdi-alert-circle</v-icon>
                        <v-icon v-else color="teal">mdi-check</v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list-item v-for="(err, index) in classes[inv.type][inv.code]" :key="index">
                        <v-list-item-content>
                          <v-list-item-title v-text="err"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require("axios");

export default {
  name: "HelloWorld",
  methods: {
    postFile() {
      let formData = new FormData();
      formData.append("file", this.file);
      this.loading = true;
      this.toDownload = false;

      axios
        .post("http://localhost:3000/file", formData, {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          this.toDownload = true;
          axios.get("http://localhost:3000/file/logs").then(data => {
            this.base = data.data.parsing;
            this.classes = data.data.classes;
            this.loading = false;
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleFileUpload() {
      this.toDownload = false;
    },
    downloadFile() {
      axios
        .get("http://localhost:3000/file", {
          responseType: "blob"
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "clav.ttl");
          document.body.appendChild(link);
          link.click();
        });
    }
  },
  data() {
    return {
      loading: false,
      file: "",
      toDownload: false,
      base: { parsing: [] },
      classes: {
        parsing: [],
        invariantes: [],
        2: { 2: [], 4: [], 5: [] },
        3: { 1: [] },
        4: { 1: [] },
        5: { 3: [] },
        6: { 2: [] },
        7: { 1: [] }
      },
      tabs: null,
      invs: [
        {
          name:
            "2.2) DF distinto: Deve haver uma relação de síntese (de ou por) entre as classes 4 filhas",
          type: 2,
          code: 2
        },
        {
          name:
            "2.4) As relações temDF e temPCA, não existem numa classe 3 se esta tiver filhos",
          type: 2,
          code: 4
        },
        {
          name:
            "2.5) As relações temDF e temPCA, existem numa classe 3 se esta não tiver filhos",
          type: 2,
          code: 5
        },
        {
          name:
            "3.1) Um processo sem desdobramento ao 4º nível tem de ter uma justificação associada ao PCA",
          type: 3,
          code: 1
        },
        {
          name:
            "4.1) Quando o PN em causa é suplemento para outro, deve ser acrescentado um critério de utilidade administrativa na justificação do respetivo PCA",
          type: 4,
          code: 1
        },
        {
          name:
            "5.3) Se um PN tem uma relação de síntese, o seu DF deverá ter uma justificação onde consta um critério de densidade informacional",
          type: 5,
          code: 3
        },
        {
          name:
            "6.2) Quando o PN em causa é complementar de outro, a justificação do DF deverá conter o critério de complementaridade informacional ",
          type: 6,
          code: 2
        },
        {
          name:
            "7.1) Um DF, na sua justificação, deverá conter apenas critérios de densidade informacional, complementaridade informacional e legal",
          type: 7,
          code: 1
        }
      ]
    };
  }
};
</script>
