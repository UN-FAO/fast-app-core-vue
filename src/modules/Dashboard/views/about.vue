<template>
  <div class="container-fluid">
    <div class="row">
      <div class="landing col-lg-10  col-md-10 col-sm-12">
         <div class="base">
              <div class="copy" style="color:rgb(14, 109, 165)" >
                  <div id="FallArmy" v-if="show">
                    <div style="background: rgb(14, 109, 165);
                    height: 30px;
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 30px;">

                      {{$t('ABOUT FAW')}}

                    </div>
                    <div class="title">
                      <small> {{this.$t('YOU SHOULD NOT PANIC')}} </small>{{$t('AT THE SIGN OF FAW IN YOUR FIELD')}}
                    </div>

                    <div class="title">
                      <small>{{$t('IMMEDIATE ACTION TO TAKE')}}</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> {{$t('Check your fields as soon as seedlings appear and continue at least two times per week until tasselling')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i>{{$t('Use your fingers to squash any whitish or greyish egg masses (about the size of your thumb) and young larvae (worms) on top and bottom of the leaves')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i>{{$t('Sprinkling ash, sand or dirt into whorls has been done by some farmers, others use soap or local botanical solutions')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i> {{$t('Some botanical insecticides (e.g. Neem) and pathogens (virus, bacteria, fungi) known to be effective')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i>{{$t('Application directly into the whorls of plants that show FAW damage can be very effective')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-check-square">
                          </i>{{$t('Pheromone traps can be used to help detect the presence, buildup and movement of FAW in your area')}}
                        </li>
                      </ul>
                    </div>






                    <div class="title">
                      <small>{{$t('CAUTION')}}</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i>{{$t('Spraying insecticides early in the crop cycle will kill off the natural enemies and may not be economical')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> {{$t('Older pesticides may be hazardous to human health and may be banned in other countries')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i>{{$t('Effectiveness of insecticides against FAW depends on the application technique, dose and formulation')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i>{{$t('Once FAW is down in the whorl, the insecticides must reach them there')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> {{$t('Spraying with backpack sprayers without delivering insecticides directly into the whorl is often ineffective')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> {{$t('Spraying insecticides several times can dramatically increase the costs of production, making the maize economically unviable')}}

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-exclamation">
                          </i> {{$t('Maize plants have a capacity to compensate for lower-level FAW infestation. Not all FAW damage causes significant maize yield reduction.')}}

                        </li>
                      </ul>
                    </div>




                    <div class="title">
                      <small>{{$t('FAW FACTS')}}</small>
                    </div>


                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('A native of the Americas, FAW is now in Africa to stay')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('A pest of more than 80 plant species')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('FAW lives about 35–61 days')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('Adult females lay eggs directly on maize leaves and hatch in 3–5 days')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('The larvae (worm or caterpillar) develop in 14–28 days, moving from the leaf to the whorl and sometimes to the maize ear')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('After development, larvae drop to the ground to pupate in the soil for 7–14 days')}}
                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('The moth appears and lives as an adult for 11–14 days, and can fly up to 100 km per night')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('FAW can breed continuously, causing several generations per year')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('In the Americas natural biological control (predators, parasitoids and pathogens) kill up to 50% of FAW in unsprayed maize fields')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('Planting date is very important – late planted maize gets attacked much more than early-planted maize')}}
                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('Increasing plant diversity (such as intercropping) can reduce FAW oviposition and increase natural enemy populations')}}
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
                        {{$t('ABOUT FAMEWS')}}
                    </div>
                    <br>

                    <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                      <small><strong style="font-size: 48px;">FAMEWS</strong> = <strong style="font-size: 25px;">F</strong>all <strong style="font-size: 25px;">A</strong>rmyworm <strong style="font-size: 25px;">M</strong>onitoring and
                        <strong style="font-size: 25px;">E</strong>arly <strong style="font-size: 25px;">W</strong>arning <strong style="font-size: 25px;">S</strong>ystem</small>
                    </div>
                    <p>

                    <div class="text">
                      <ul class="fa-ul">
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The app is to be used every time fields are checked (scouting) and pheromone traps are counted for Fall Armyworm (FAW), Africa Armyworm (AAW) and Stem Borer')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The primary target user is the farmer, supplemented by community focal persons, extension agents and plant protection officers when the farmer does not have a smart phone')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('Relying solely on extension agents or plant protection officers may not give the desired coverage as they are unlikely to be able to visit all farms on a regular and timely basis')}}


                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The app has three sections: General information, Field scouting and Pheromone traps')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('Some information is required (indicated by a red asterisk) that must be entered before continuing')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The app is multilingual – initially English and French')}}

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The app should be used in conjunction with the FAO Guidance Notes on Scouting and Trapping')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('Data can be transmitted immediately or stored and sent once a connection becomes available')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i>{{$t('The app allows users to monitor FAW, AAW and Stem Borer')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('Data from the app provides farmers, communities and countries with early warning and advice on changes in FAW population levels and distribution in order to protect their crops')}}

                        </li>
                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('The app is very intuitive and easy to use – it should take about 10 minutes to learn')}}

                        </li>

                        <li>
                          <i style="color:rgb(14, 109, 165)" class="fa-li fa fa-info-circle">
                          </i> {{$t('FAMEWS was inspired by AWorldBridge (aworldbridge.com) students and developed by FAO IT-Solutions based on their ideas and inputs from affected countries and other partners')}}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
                    <div v-if="!show">
                      <q-btn  color="primary" @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']">{{$t('ABOUT FAW')}}</q-btn>
                  </div>
                    <q-btn  color="primary" @click="togglePage(false)" v-if="show" v-bind:class="[!show ? 'showing' : '', 'notShowing']">{{$t('ABOUT FAMEWS')}}</q-btn>
                 </div>
              </div>
        </div>
       </div>
    </div>
  </div>
</template>

<script>
import { QBtn } from 'quasar';
export default {
  components: {
    QBtn
  },
  async mounted() {
    this.$eventHub.on('FAST:LANGUAGE:CHANGED', async (language) => {
      this.language = language.code;
    });
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
  color: rgb(14, 109, 165);
  -webkit-background-clip: text;
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
