<template>

<div class="row">

    <div class="statBubbleContainer">
    <div class="statBubble websitesLaunched">
      <div class="statNum">
      {{totalTranslations}}
      </div>
    </div>
      <h3>Total Labels</h3>
        </div>

        <div class="statBubbleContainer">
    <div class="statBubble websitesLaunched">

      <div class="statNum">
          {{englishPorcentage}}%
      </div>
    </div>
      <h3>English Translations</h3>
        </div>



        <div class="statBubbleContainer">
    <div class="statBubble websitesLaunched">
      <div class="statNum">
        {{frenchPorcentage}}%
      </div>
    </div>
      <h3>French Translations</h3>
        </div>
  </div>
</template>
<script>
export default {
  name: "tstats",
  props: {
    stats: {
      required: true
    }
  },
  watch: {
    stats: function(stats) {
      this.stats = stats;
    }
  },
  computed: {
    totalTranslations() {
      if (this.stats && this.stats.totalTranslations) {
        return this.stats.totalTranslations;
      }
      return 0;
    },
    englishPorcentage() {
       if (this.stats && this.stats.translations) {
       return Math.round(this.stats.translations.en.translated * 100)
      }
      return 0
    },
    frenchPorcentage() {
       if (this.stats && this.stats.translations) {
       return Math.round(this.stats.translations.fr.translated * 100)
      }
      return 0
    }
  }
};
</script>
<style>
.translations-action-bar {
  padding-bottom: 30px;
}

.underline {
  text-decoration: underline;
}

.statBubbleContainer {
  width: 163px;
  height: 250px;
  position: relative;
  cursor: pointer;
  text-align: center;
  margin: auto;
  margin-top: 50px;
  display: inline-block;
  margin-left: 36px;
  margin-right: 36px;
}

.nounderline {
  text-decoration: none;
}

.statBubbleContainer h3 {
  font-family: "segoe ui bold", arial;
  font-size: 14px;
  color: #828282;
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -apple-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.statBubbleContainer:hover > h3 {
  color: #0e76bc;
}

.statBubbleContainer:hover > .statBubble {
  border: 6px solid #0e76bc;
  background-position: center -140px;
}

.statBubbleContainer:hover .statNum {
  color: #0e76bc;
}

.websitesLaunched::after {
  content: "\f1ab";
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
  text-decoration: inherit;
  padding-top: 40px;
  font-size: 90px;
  color: lightgray;
}

.statBubble {
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  border: 6px solid #ddd;
  background-repeat: no-repeat;
  background-position: center 25px;
  position: relative;
  text-align: center;
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -apple-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.statNum {
  position: absolute;
  font-family: "segoe ui light", arial;
  left: 0;
  right: 0;
  margin-top: 30%;
  line-height: 150px;
  vertical-align: middle;
  font-size: 40px;
  color: black;
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -apple-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
</style>


