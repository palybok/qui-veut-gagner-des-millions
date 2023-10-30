<template>
    <div class="global-container">        
        <div class="container">
            <div  v-if="level.value !== 0" class="cursor" :style="{ transform: `translateY(calc(${15 - level} * 3rem))` }"></div>
            <v-row class="row-level" v-for="tier in tiers" :key="tier.level">
                <v-col cols="2" class="level" :class="get_text_class(tier)" >
                    {{ tier.level }}
                </v-col>
                <v-col cols="1" class="win" >
                    <p v-if="!presentation">{{ tier.win ? '✓' : '' }}</p>
                </v-col>
                <v-col cols="9" class="amount-text pr-5"  :class="get_text_class(tier)">
                    {{ tier.text_amount }}
                </v-col>
            </v-row>            
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const level = ref(0)

const props = defineProps({
    from_amount: {
        type: Number,
        default: 0
    },
    to_amount: {
        type: Number,
        default: 0
    },
    presentation: {
        type: Boolean,
        default: false
    }
})

watch(() => props.presentation, (state) => {
    if (state) {
        level.value = 1

        setTimeout(() => {
            level.value = 5
        }, 3000)

        setTimeout(() => {
            level.value = 10
        }, 6000)

        setTimeout(() => {
            level.value = 15
        }, 9000)
    }
});

watch(() => props.to_amount, (from) => {
    set_level(props.from_amount, props.to_amount)
});


const tiers = [
    { level: 15, amount: 1000000, text_amount: '1 MILLION €', pallier: true, win: false },
    { level: 14, amount: 300000, text_amount: '300 000 €', pallier: false, win: false },
    { level: 13, amount: 150000, text_amount: '150 000 €', pallier: false, win: false },
    { level: 12, amount: 100000, text_amount: '100 000 €', pallier: false, win: false },
    { level: 11, amount: 72000, text_amount: '72 000 €', pallier: false, win: false },
    { level: 10, amount: 48000, text_amount: '48 000 €', pallier: true, win: false },
    { level: 9, amount: 24000, text_amount: '24 000 €', pallier: false, win: false },
    { level: 8, amount: 12000, text_amount: '12 000 €', pallier: false, win: false },
    { level: 7, amount: 6000, text_amount: '6 000 €', pallier: false, win: false },
    { level: 6, amount: 3000, text_amount: '3 000 €', pallier: false, win: false },
    { level: 5, amount: 1500, text_amount: '1 500 €', pallier: true, win: false },
    { level: 4, amount: 800, text_amount: '800 €', pallier: false, win: false },
    { level: 3, amount: 500, text_amount: '500 €', pallier: false, win: false },
    { level: 2, amount: 300, text_amount: '300 €', pallier: false, win: false },
    { level: 1, amount: 200, text_amount: '200 €', pallier: true, win: false },

]


const get_text_class = (tier) => {
    if (tier.level === level.value) 
        return 'text-black'

    if (tier.pallier) 
        return 'text-pallier'
    
    return ''
}

function define_win(level) {
    for (let tier of tiers) {
        tier.win = false;
        if (tier.level <= level && level !== 1) {
            tier.win = true;
        }
    }
}

function set_level(from, to) {
    if(props.presentation) return;

    if (from === 0 && to === 0) {
        level.value = 0
        define_win(level.value); 
        return;
    }
    

    for (let tier of tiers) {
        if (tier.amount === from) {
            level.value = tier.level
            break;
        }
    }
    define_win(level.value)

    setTimeout(() => {
        for (let tier of tiers) {
            if (tier.amount === to) {
                level.value = tier.level
                break;
            }
        }

        define_win(level.value)
    }, 2000)
}

set_level(props.from_amount, props.to_amount)
</script>

<style scoped>

.no-radius {
    border-radius: 0 !important;
}

.amount-text, .level {
    font-family: 'Ultra', serif;
    font-size: 1rem;
    color: #e98718;    
    transition: all 1s ease-in-out;
}

.amount-text {
    letter-spacing: .5rem;
    text-align: right;
}

.text-black {
    color: #000;
}

.text-pallier, .win {
    color: #fff !important;
}

.win{
    text-align: left;
}

.cursor {
    background-color: orange;
    position: absolute;
    width: 100%;
    height: 1.6rem; 
    transition: transform 0.5s ease-in-out; 
    z-index: 1;
}
.row-level {
    z-index: 2;
    position: relative;
    height: 6.667%;     
}
.container{
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 0;
}

.global-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 15px;
}
</style>