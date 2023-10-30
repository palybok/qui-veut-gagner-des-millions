<template>
    <div>
        <v-btn v-if="joker" class="joker" style="background-image: url('public.svg')"></v-btn>
        <v-btn v-else class="joker" style="background-image: url('no_public.svg')"></v-btn>
    </div>
</template>

<script setup>
    
const { joker } = defineProps({
    joker: Boolean
})
</script>

<style scoped>
.joker {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    padding:5px;
}
</style>