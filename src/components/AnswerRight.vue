<template>
    <div class="answer-right">
        <div class="answer-bg" :class="type">
            <div class="answer-content">
              <span class="deco">♦</span>&nbsp;<span class="tag">{{ tag }}:</span>&nbsp;<span class="text">{{ value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const { tag, value, type } = defineProps({
    tag: String,
    value: String,
    type: String
})
</script>

<style scoped>
.answer-right {
    position: relative;
    width: 100%;
}

.answer-bg {
    position: relative;
    width: 100%;
    padding-top: 15%;
    background-image: url("answer_right.svg");
    background-size: 100%;
    background-position: center center;
    z-index: 1;
    transition: all 0.3s ease-in-out;
}

.answer-content {
    position: absolute;
    top: 0;
    left: 11%;
    right: 29%;
    bottom: 0;
    padding: 10px;
    z-index: 2;
    display: flex;
    align-items: center;
    color: white;
    font-weight: 500;
    font-size: 1.5rem;
}

.deco{
    transform: rotate(90deg);
}
.deco, .tag {
    color: #FF9800;
    font-weight: 800;
    font-size: 2.5rem;
}

.text {
    font-weight: 500;
    font-size: 2.5rem;
    margin-left: 10px;
    color: white;
}

.answer-bg.selected {
    background-image: url("answer_right_orange.svg");
}
.answer-bg.success {
    background-image: url("answer_right_green.svg");
}
.answer-bg.selected .tag {
    color: black;
}
.answer-bg.success .tag {
    color: black;
}
.answer-bg.selected .text {
    color: black;
}
.answer-bg.success .text {
    color: black;
}
.answer-bg.selected .deco {
    color: white;
}
.answer-bg.success .deco {
    color: white;
}
</style>