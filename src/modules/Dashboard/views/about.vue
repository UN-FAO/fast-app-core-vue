<template>
  <div class="container-fluid">
    <div class="row">
      <div class="landing col-lg-10  col-md-10 col-sm-12">
         <div class="base">
                 <div class="copy" v-if="selectedLanguage === 'fr'">
                  <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
                    <small>

                    <div v-if="!show">
                    <span>Au sujet de </span><span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']"> FAW</span>
                    </div>

                    <span v-if="show">Au sujet de </span> <span @click="togglePage(false)" v-if="show" v-bind:class="[!show ? 'showing' : '', 'notShowing']"> FAMEWS</span> </small>
                  </div>

                  <div id="FallArmy" v-if="show">
                    <div style="background: rgb(14, 109, 165);
                    height: 30px;
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 30px;">
                        Au sujet de FAW
                    </div>
                    <div class="title">
                      <small>VOUS NE DEVRIEZ PAS PANIQUER  </small>AU SIGNE DE FAW DANS VOTRE FERME
                    </div>

                    <div class="title">
                      <small>ACTION IMMÉDIATE À PRENDRE</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Vérifiez vos fermes dès que les semis apparaissent et continuez au moins deux fois par semaine
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Utilisez vos doigts pour écraser les masses d'œufs blanchâtres ou grisâtres (environ la taille de votre pouce) et les jeunes larves (vers) sur le haut et le bas des feuilles
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Certains paysans ont répandu de la cendre, du sable ou de la terre dans les verticilles, d'autres utilisent du savon ou des solutions botaniques locales
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Certains insecticides botaniques (par exemple Neem) et pathogènes (virus, bactéries, champignons) connus pour être efficaces
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> L'application directement dans les verticilles des plantes qui montrent des dommages FAW peut être très efficace
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Les pièges à phéromones peuvent être utilisés pour aider à détecter la présence, l'accumulation et le mouvement de FAW dans votre région
                        </li>
                      </ul>
                    </div>

                    <div class="title">
                      <small>CAUTION</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> L'application d'insecticides tôt dans le cycle de la culture tue les ennemis naturels et peut ne pas être économique

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Les pesticides plus anciens peuvent être dangereux pour la santé humaine et peuvent être interdits dans d'autres pays

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> L'efficacité des insecticides contre les FAW dépend de la technique d'application, de la dose et de la formulation

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Une fois que FAW est dans le verticille, les insecticides doivent les atteindre
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> L'application de pesticides avec des pulvérisateurs à dos sans fournir d'insecticides directement dans le verticille est souvent inefficace
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> L'application d'insecticides à plusieurs reprises peut augmenter considérablement les coûts de production, rendant le maïs économiquement non viable
                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Les plantes de maïs ont une capacité à compenser l'infestation FAW de niveau inférieur. Tous les dégâts causés par les FAW n'entraînent pas une réduction significative du rendement du maïs.
                        </li>
                      </ul>
                    </div>




                    <div class="title">
                      <small>FAW FAQ</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Originaire des Amériques, FAW est maintenant en Afrique pour rester

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Un ravageur de plus de 80 espèces végétales

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAW vit environ 35–61 jours


                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Les femelles adultes pondent leurs oeufs directement sur les feuilles de maïs et éclosent en 3–5 jours

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Les larves (ver ou chenille) se développent en 14–28 jours, se déplaçant de la feuille au verticille et parfois à l'épi de maïs

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Après le développement, les larves tombent au sol pour se nymphoser dans le sol pendant 7–14 jours

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Le papillon apparaît et vit en tant qu'adulte pendant 11–14 jours, et peut voler jusqu'à 100 km par nuit

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAW peut se reproduire en continu, causant plusieurs générations par an

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Dans les Amériques, le contrôle biologique naturel (prédateurs, parasitoïdes et pathogènes) tue jusqu'à 50% des FAW dans les champs de maïs non traités

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> La date de plantation est très importante – le maïs tardif est attaqué beaucoup plus que le maïs planté tôt

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'augmentation de la diversité végétale (telle que la culture intercalaire) peut réduire la ponte FAW et augmenter les populations d'ennemis naturels

                        </li>
                      </ul>
                    </div>
                  </div>


                  <div id="FAMEWS" v-if="!show">

                    <div style="background: rgb(14, 109, 165);
                    height: 30px;
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 30px;">
                        Au sujet de FAMEWS
                    </div>
                    <br>

                    <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                      <small>FAMEWS = <strong style="font-size: 25px;">F</strong>all <strong style="font-size: 25px;">A</strong>rmyworm <strong style="font-size: 25px;">M</strong>onitoring and
                        <strong style="font-size: 25px;">E</strong>arly <strong style="font-size: 25px;">W</strong>arning <strong style="font-size: 25px;">S</strong>ystem</small>
                    </div>
                    <p>

                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application doit être utilisée à chaque fois que les fermes sont vérifiés (surveillance) et les pièges à phéromones sont comptés pour les légionnaires d'automne (FAW), les légionnaires de l'Afrique (AAW) et les perce-tiges
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'utilisateur principal est l'agriculteur, complété par des points focaux communautaires, des agents de vulgarisation et des agents de protection des végétaux lorsque l'agriculteur n'a pas de smartphone

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> S'appuyer seulement sur les agents de vulgarisation ou les agents de protection des végétaux peut ne pas offrir la couverture désirée, car il est peu probable qu'ils puissent visiter toutes les fermes de façon régulière et opportune

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application comporte trois sections : Informations Générales, Surveillance et Pièges à phéromones

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Certaines informations sont requises (indiquées par un astérisque rouge) qui doivent être enregistré avant de continuer

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application est multilingue - initialement anglais et français

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application doit être utilisée conjointement avec les Notes d'orientation de la FAO sur le Surveillance et le Piégeage

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Les données peuvent être transmises immédiatement ou stockées et envoyées une fois qu'une connexion est disponible

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application permet aux utilisateurs de surveiller FAW, AAW et perce-tige

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Les données de l'application fournissent aux agriculteurs, aux communautés et aux pays un avertissement précoce et des conseils sur les changements dans les niveaux de population FAW et la distribution afin de protéger leurs cultures

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> L'application est très intuitive et facile à utiliser – cela devrait prendre environ 10 minutes pour apprendre
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAMEWS a été inspiré par AWorldBridge (aworldbridge.com) étudiants et développé par FAO IT-Solutions en fonction de leurs idées et des contributions des pays touchés et d'autres partenaires
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
                    <small>

                    <div v-if="!show">
                    <span>Au sujet de </span><span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']"> FAW</span>
                  </div>

                    <span v-if="show">Au sujet de </span> <span @click="togglePage(false)" v-if="show" v-bind:class="[!show ? 'showing' : '', 'notShowing']"> FAMEWS</span> </small>
                 </div>
              </div>

              <div class="copy" v-if="selectedLanguage !== 'fr'">
                  <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
                    <small>

                    <div v-if="!show">
                    <span>ABOUT</span><span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']"> FAW</span>
                    </div>

                    <span v-if="show">ABOUT</span> <span @click="togglePage(false)" v-if="show" v-bind:class="[!show ? 'showing' : '', 'notShowing']"> FAMEWS</span> </small>
                  </div>

                  <div id="FallArmy" v-if="show">
                    <div style="background: rgb(14, 109, 165);
                    height: 30px;
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 30px;">
                        ABOUT FAW
                    </div>
                    <div class="title">
                      <small>YOU SHOULD NOT PANIC </small>AT THE SIGN OF FAW IN YOUR FIELD
                    </div>

                    <div class="title">
                      <small>IMMEDIATE ACTION TO TAKE</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Check your fields as soon as seedlings appear and continue at least two times per week until tasselling
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Use your fingers to squash any whitish or greyish egg masses (about the size of your thumb) and young larvae (worms) on top and bottom of the leaves

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Sprinkling ash, sand or dirt into whorls has been done by some farmers, others use soap or local botanical solutions
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Some botanical insecticides (e.g. Neem) and pathogens (virus, bacteria, fungi) known to be effective
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Application directly into the whorls of plants that show FAW damage can be very effective
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> Pheromone traps can be used to help detect the presence, buildup and movement of FAW in your area
                        </li>
                      </ul>
                    </div>






                    <div class="title">
                      <small>CAUTION</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Spraying insecticides early in the crop cycle will kill off the natural enemies and may not be economical

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Older pesticides may be hazardous to human health and may be banned in other countries

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Effectiveness of insecticides against FAW depends on the application technique, dose and formulation

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Once FAW is down in the whorl, the insecticides must reach them there
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Spraying with backpack sprayers without delivering insecticides directly into the whorl is often ineffective
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Spraying insecticides several times can dramatically increase the costs of production, making the maize economically unviable

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> Maize plants have a capacity to compensate for lower-level FAW infestation. Not all FAW damage causes significant maize yield reduction.

                        </li>
                      </ul>
                    </div>




                    <div class="title">
                      <small>FAW FACTS</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> A native of the Americas, FAW is now in Africa to stay
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> A pest of more than 80 plant species
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAW lives about 35–61 days

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Adult females lay eggs directly on maize leaves and hatch in 3–5 days
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The larvae (worm or caterpillar) develop in 14–28 days, moving from the leaf to the whorl and sometimes to the maize ear
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> After development, larvae drop to the ground to pupate in the soil for 7–14 days
                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The moth appears and lives as an adult for 11–14 days, and can fly up to 100 km per night
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAW can breed continuously, causing several generations per year
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> In the Americas natural biological control (predators, parasitoids and pathogens) kill up to 50% of FAW in unsprayed maize fields
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Planting date is very important – late planted maize gets attacked much more than early-planted maize
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Increasing plant diversity (such as intercropping) can reduce FAW oviposition and increase natural enemy populations
                        </li>
                      </ul>
                    </div>
                  </div>


                  <div id="FAMEWS" v-if="!show">

                    <div style="background: rgb(14, 109, 165);
                    height: 30px;
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 30px;">
                        ABOUT FAMEWS
                    </div>
                    <br>

                    <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                      <small>FAMEWS = <strong style="font-size: 25px;">F</strong>all <strong style="font-size: 25px;">A</strong>rmyworm <strong style="font-size: 25px;">M</strong>onitoring and
                        <strong style="font-size: 25px;">E</strong>arly <strong style="font-size: 25px;">W</strong>arning <strong style="font-size: 25px;">S</strong>ystem</small>
                    </div>
                    <p>

                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app is to be used every time fields are checked (scouting) and pheromone traps are counted for Fall Armyworm (FAW), Africa Armyworm (AAW) and Stem Borer

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The primary target user is the farmer, supplemented by community focal persons, extension agents and plant protection officers when the farmer does not have a smart phone

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Relying solely on extension agents or plant protection officers may not give the desired coverage as they are unlikely to be able to visit all farms on a regular and timely basis


                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app has three sections: General information, Field scouting and Pheromone traps

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Some information is required (indicated by a red asterisk) that must be entered before continuing

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app is multilingual – initially English and French

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app should be used in conjunction with the FAO Guidance Notes on Scouting and Trapping

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Data can be transmitted immediately or stored and sent once a connection becomes available

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app allows users to monitor FAW, AAW and Stem Borer

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> Data from the app provides farmers, communities and countries with early warning and advice on changes in FAW population levels and distribution in order to protect their crops

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> The app is very intuitive and easy to use – it should take about 10 minutes to learn

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> FAMEWS was inspired by AWorldBridge (aworldbridge.com) students and developed by FAO IT-Solutions based on their ideas and inputs from affected countries and other partners
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
                    <small>

                    <div v-if="!show">
                    <span>ABOUT</span><span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']"> FAW</span>
                  </div>

                    <span v-if="show">ABOUT</span> <span @click="togglePage(false)" v-if="show" v-bind:class="[!show ? 'showing' : '', 'notShowing']"> FAMEWS</span> </small>
                 </div>
              </div>

        </div>
       </div>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    this.$eventHub.on('FAST:LANGUAGE:CHANGED', async (language) => {
      this.language = language.code;
    });
  },
  computed: {
    selectedLanguage() {
      return this.language;
    }
  },
  data: function() {
    return {
      show: false,
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en'
    };
  },
  methods: {
    togglePage(value) {
      this.show = value;
    }
  }
};
</script>

<style scoped>
.showing {
  text-decoration: underline;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
}

.showing:hover,
.notShowing:hover {
  background: rgb(14, 109, 165);
  color: white;
}
.notShowing {
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  cursor: pointer;
}
/*--------------------
        Landing
        --------------------*/

.landing {
  z-index: 2;
  margin: 25px auto;
  overflow: hidden;
}

.landing .base {
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 38px;
  color: #082352;
  background: #fff;
}

/*--------------------
        Copy
        --------------------*/

.copy {
  position: relative;
  z-index: 2;
}

.copy .title {
  font-size: 52px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 30px;
  margin-left: -3px;
  background-image: linear-gradient(
    45deg,
    rgb(14, 109, 165),
    rgb(14, 109, 165)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.copy .title small {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  margin-top: 50px;
  line-height: 1;
  display: block;
  text-indent: 3px;
}

.copy .text {
  color: #282652;
  width: 80%;
  font-size: 100%;
}

.copy .cta {
  cursor: pointer;
  margin-top: 40px;
  background: linear-gradient(25deg, #2f2d56, #6e355b);
  color: #fff;
  text-transform: uppercase;
  display: inline-block;
  border-radius: 30px;
  text-decoration: none;
  padding: 10px 30px;
  font-weight: 600;
}

.base.overlay .title {
  background-image: linear-gradient(0, #fff, #fff);
}

li {
  margin-bottom: 20px;
}
</style>
