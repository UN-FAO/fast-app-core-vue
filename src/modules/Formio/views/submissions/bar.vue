
<script>
import VueCharts from 'vue-chartjs'
export default {
    name: 'mybar',
    extends: VueCharts.Bar,
    mixins: [VueCharts.mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }

}
</script>