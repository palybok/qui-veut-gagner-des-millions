<template>
    <div class="countdown-container">
        <img src="rosace.png" alt="Rosace" class="rosace-img">

        <svg class="circle-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle class="circle-bg" cx="50" cy="50" r="45"></circle>
            <circle class="circle-fg-shadow" cx="50" cy="50" r="45" :style="circleStyle"></circle>
            <circle class="circle-fg" cx="50" cy="50" r="45" :style="circleStyle"></circle>
   
        </svg>
        <div :class="['number', { 'red-number': isRed }]">{{ secondsLeft }}</div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const { time } = defineProps({
    time: Number
});

let secondsLeft = ref(time);
let timer;
let circleStyle = computed(() => {
    let strokeDasharrayTotal = 283;
    let strokeDashoffset = ((secondsLeft.value / time) * 283) - 283;
    return {
        strokeDasharray: strokeDasharrayTotal.toString(),
        strokeDashoffset: strokeDashoffset.toString(),
    };
});
let isRed = computed(() => {
    return secondsLeft.value <= 10;
});



onMounted(() => {
    startTimer();
});

function startTimer() {
    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        secondsLeft.value--;

        if (secondsLeft.value <= 0) {
            clearInterval(timer);
        }
    }, 1000);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ultra&display=swap');
.countdown-container {
    position: relative;
    width: 250px;
    height: 250px;
    padding: 10px;
    display: flex; 
    justify-content: center;
    align-items: center;
    background: linear-gradient(-45deg, rgb(9, 9, 120), black, rgb(20, 20, 152)); 
    border-radius: 50%; 
}

.rosace-img {
    position: absolute;
    width: 79%;  /* Ajustez cette valeur si nécessaire */
    height: 79%; /* Ajustez cette valeur si nécessaire */
    z-index: 0;  /* Placer sous le SVG */
    opacity: 0.2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.circle-svg {
    transform: rotate(-90deg);
    width: 90%;
    height: 90%;
    margin: 5%;
    overflow: initial;
    z-index: 1;  /* Placer au-dessus de l'image */
}

.circle-bg {
    fill: none;
    stroke: #d58ff1;
    stroke-width: 4;
}
.circle-fg {
    fill: none;
    stroke: rgb(246, 144, 11);
    stroke-width: 8; /* Même épaisseur que circle-bg */
}

.circle-fg-shadow {
    fill: none;
    stroke: rgb(246, 144, 11);
    stroke-width: 9; /* légèrement plus épais pour créer un effet de surbrillance */
    filter: drop-shadow(0 0 5px rgba(246, 144, 11, 0.8)); /* Effet de surbrillance */
}

.number {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 6rem;
    transform: translate(-50%, -50%);
    z-index: 10;
    font-family: 'Ultra', serif;
    color: white;
}

.red-number {
    color: rgb(206, 29, 29);
}
</style>