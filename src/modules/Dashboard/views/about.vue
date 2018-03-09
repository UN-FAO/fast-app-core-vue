<template>
  <div class="container-fluid">
    <div class="row">
      <div class="landing col-lg-10  col-md-10 col-sm-12">
        <div class="base">
          <div class="copy">

            <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
              <small>ABOUT
                <span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']">DRIP</span>
                    </small>
            </div>

            <div id="FAMEWS" v-if="show">
              <div class="title">
                <small>ABOUT</small>DRIP
              </div>

              <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                <small><strong style="font-size: 25px;">The Dryland Restoration Initiative Platform (DRIP) </strong>

                </small>
              </div>
              <p>

              <div class="text">
                Is an interactive web portal to support practitioners, project managers, policy-makers and decision-makers in compiling and analysing data and capturing and sharing lessons learned from restoration initiatives, thus advancing the monitoring and assessment of these initiatives globally. DRIP was developed and tested with the active participation of dryland restoration experts and practitioners worldwide.

              </div>
              <p>
              <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                <small><strong style="font-size: 25px;">The DRIP Tool </strong>

                </small>
              </div>
               <div class="text">
                   <span>Is an online tool hosted on the Dryland Restoration Initiative Platform that allows to compile data from restoration projects, programmes and initiatives. It captures information from users via an easily understandable questionnaire that can be completed in a few minutes.</span>
                    <br>
                  <span> Restoration experts need to register before starting to use the DRIP tool. The DRIP survey obtains information in five sections:</span>

              </div>
                <p>
                <div class="text">
                   <ol>
                     <li><span style="font-size:20px">General information</span> <br> General information on the restoration initiative (location, scope, type of initiative, …)</li>
                      <li><span style="font-size:20px">Description of the area and baseline</span><br>Data on the area where the initiative is carried out, including on its climate, geomorphology, soil, land degradation (causes and type of degradation), as well as socio-economic and environmental baseline data, i.e. before the start of the restoration initiative</li>
                      <li><span style="font-size:20px">Objectives and strategy</span> <br> Objectives of the restoration initiative, and the type of approach used (e.g. species used, techniques, training and other activities)</li>
                      <li><span style="font-size:20px">Monitoring and evaluation </span><br> Information on monitoring and evaluation activities implemented as part of the restoration initiative</li>
                      <li><span style="font-size:20px">Results and impacts</span> <br> Main achievements in terms of results (such as activities, number of hectares successfully restored, and related costs), impacts (environmental and socio-economic, but also in terms of capacity development and sustainability of the results achieved), as well as the main challenges encountered and lessons learnt.</li>
                   </ol>
              </div>

              <div class="text">
                Once completed, the survey data is submitted to FAO, which compiles and analyses all the data received into a global database of restoration initiatives. The data then becomes freely accessible through the DRIP.
              </div>

            </div>

            <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
              <small>ABOUT
                <span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']">DRIP</span>
                    </small>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      show: true
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
  box-shadow: 0 3px 30px rgba(0, 0, 0, 0.3);
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
