<template>
  <div class="container-fluid">
    <div class="row">
      <div class="landing col-lg-10 col-md-12 col-sm-12">

        <div class="base">
          <div class="copy">
           <!--
            <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
              <small>ABOUT
                <span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']">Fall Armyworm</span>
                /
                <span @click="togglePage(false)" v-bind:class="[!show ? 'showing' : '', 'notShowing']">FAMEWS</span> </small>
            </div>

            <div class="title"></div>
           -->
            <div class="row">

                <div class="col-lg-5 col-md-5 col-sm-12">
                </div>
                <div class="col-lg-7 col-md-7 col-sm-12" id="FallArmy" v-if="show">
                    <h1>About SHARP+</h1>
                </div>
            </div>
           <div class="row">
            <div class="col-lg-5 col-md-5 col-sm-12">
                <div class="image">
                    <img src=../../../assets/imgs/timeline.png>
                </div>
            </div>

            <div class="col-lg-7 col-md-7 col-sm-12" id="FallArmy" v-if="show">
                  <div class="text">
                      <p>
                          The <b>Self and Holistic Assessment of Resilience for farmers and Pastoralists</b> (SHARP) tool was developed by FAO to collect, share and analyse information, concerns and interests of farmers and pastoralists in a participatory self-assessment manner in the context of climate change. Since 2015, SHARP has been included in several projects in <span class="highlight">18 different countries</span> and collected information on <span class="highlight">more than 3500 households</span>, providing <b>training workshops</b> to FAO country offices, governments, researchers, facilitators, enumerators and farmers.
                      </p><br>
                      <p>
                          <b>SHARP</b> highlights the priorities for <b>strengthening climate resilience in rural communities</b> across the agronomic, environmental, social and economic components of assessed households.  SHARP is both an <b>assessment</b> and a <b>monitoring & evaluation tool</b>, which identifies areas of poor resilience and provides a baseline for intervention in the field, enabling comparison within and across communities, providing meaningful contextualized data which can be used to support farmers and pastoralists.
                    </p><br>
                    <p>
                        After incorporating the lessons learned in the field in the past 3 years and technically reviewing the tool, <b>SHARP+</b> arises as an improved version of the SHARP former tool and it is released to the public in 2018. The SHARP+ application contains <b>better targeted and focused questions, new modules,</b> as well as more <b>robust scoring system</b> that jointly allow for a more accurate resilience assessment and understanding of small-scale agricultural producer’s livelihoods in the context of climate change.
                    </p><br>
                    <p>
                        If you wish to know more about SHARP and SHARP+, you can go to:
                    </p>
                        <ul class="fa-ul">
                            <li><i style="color:rgb(14, 109, 165)" class="fa-li fa fa-link"></i>
                                <p><a href="http://www.fao.org/in-action/sharp/en/">SHARP Website</a></p>
                            </li>
                            <li><i style="color:rgb(14, 109, 165)" class="fa-li fa fa-google"></i>
                                <p><a href="http://www.fao.org/in-action/sharp/en/">Google Play Store</a></p>
                            </li>
                            <li><i style="color:rgb(14, 109, 165)" class="fa-li fa fa-flickr"></i>
                                <p><a href="http://www.fao.org/in-action/sharp/en/">Flickr album</a></p>
                            </li>
                            <li><i style="color:rgb(14, 109, 165)" class="fa-li fa fa-envelope-o"></i>
                                <p>Or contact us at: <a href="mailto:SHARP@fao.org">SHARP@fao.org</a></p>
                            </li>
                         </ul>
                  </div>

            </div>

        <!--
            <div id="FAMEWS" v-if="!show">
              <div class="title">
                <small>ABOUT</small>FAMEWS
              </div>

              <div style="font-size: 20px; font-weight: 600;  text-transform: uppercase;cursor: pointer; color: rgb(14, 109, 165);">
                <small>FAMEWS = <strong style="font-size: 25px;">F</strong>all <strong style="font-size: 25px;">A</strong>rmyworm <strong style="font-size: 25px;">M</strong>onitoring and
                  <strong style="font-size: 25px;">E</strong>arly <strong style="font-size: 25px;">W</strong>arning <strong style="font-size: 25px;">S</strong>ystem</small>
              </div>
              <p>

              <div class="text"></div>
            </div>



             <div style="text-align: right; color: rgb(14, 109, 165); font-size: 16px;">
              <small>ABOUT
                <span @click="togglePage(true)"  v-bind:class="[show ? 'showing' : '', 'notShowing']">Fall Armyworm</span>
                /
                <span @click="togglePage(false)" v-bind:class="[!show ? 'showing' : '', 'notShowing']">FAMEWS</span> </small>
             </div>
        -->

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
      this.show = value
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

.showing:hover, .notShowing:hover {
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
  padding: 5px;
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
    .copy .image {margin-bottom: 30px;}
    .copy .image img {width: 100%; max-width: 450px;}

    .copy .text {
      color: #282652;
      font-size: 100%;
    }

    .copy .text .highlight {font-size:1.4em; color:#b70509; font-weight: 500; letter-spacing: -0.25px;}

    .copy .text ul {margin-top: 20px; margin-bottom: 30px;}
    .copy .text li {margin-bottom: 15px;}
    .copy .text li i {font-size: 1.4em;}

    .copy .text p {font-size: inherit;}

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

</style>
