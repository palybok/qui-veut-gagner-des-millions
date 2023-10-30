<template>
    <div class="question">
        <div class="question-bg">
            <div class="question-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.question {
    position: relative;
    width: 100%;
}

.question-bg {
    position: relative;
    width: 100%;
    padding-top: 12%;
    background-image: url("question.svg");
    background-size: 100%;
    background-position: center center;
    z-index: 1;
}

.question-content {
    position: absolute;
    /* background: red; */
    top: 0%;
    left: 17%;
    right: 17%;
    bottom: 0%;
    padding: 10px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    font-size: 2.5rem;
}
</style>
