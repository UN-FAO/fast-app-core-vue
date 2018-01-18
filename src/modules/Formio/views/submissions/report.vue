<template>
    <q-card color="white">
        <q-card-title>
            Card Title
            <q-btn icon="create" @click="changeData">Change Data</q-btn>
        </q-card-title>
        <q-card-separator />
        <q-card-main>
            Card Content
            <mybar :chartData="_chartComputedInfo" :options="reportOptions"></mybar>
        </q-card-main>
    </q-card>
</template>

<script>
import {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QBtn
} from "quasar";
import mybar from './bar'
export default {
    components: {
        QCard,
        QCardTitle,
        QCardSeparator,
        QCardMain,
        mybar,
        QBtn
    },
    data: function() {
        return {
            ourData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            reportOptions: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    },
    methods: {
        changeData() {
            this.ourData = this.ourData.map((v) => {
                return v + Math.random()
            })
        }
    },
    computed: {
        _chartComputedInfo() {
            return {
                labels: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                datasets: [
                    {
                        label: 'GitHub Commits',
                        backgroundColor: '#f87979',
                        data: this.ourData
                    }
                ]
            }
        }
    }
}
</script>
<style SCOPED>
.q-card-title {
    color: red;
}
</style>
