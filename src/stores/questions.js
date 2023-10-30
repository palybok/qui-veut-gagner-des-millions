import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { useSockets } from '@/stores/sockets'
import { useConfig } from '@/stores/config'

export const useQuestions = defineStore('questions', () => {
  
    // Sockets
    const ws = useSockets()

    // Config
    const config = useConfig()

    // Answers
    const answers = ref({
      a: { value: null, type: null },
      b: { value: null, type: null },
      c: { value: null, type: null },
      d: { value: null, type: null }
    })

    // Question
    const question = ref(null)

    // Correct answer like 'a', 'b', 'c' or 'd'
    const correct = ref(null)

    // Abandonned
    const abandonned = ref(false)

    // Selected answer like 'a', 'b', 'c' or 'd'
    const selected = ref(null)

    // List of questions
    const questions = config.questions
    
    function reset(){
      correct.value = null
      selected.value = null
      question.value = null
      abandonned.value = false
      answers.value.a = { value: null, type: null };
      answers.value.b = { value: null, type: null };
      answers.value.c = { value: null, type: null };
      answers.value.d = { value: null, type: null }; 
      ws.question(question.value, answers.value);
      return true
    }

    function reset_type(){
      Object.keys(answers.value).forEach(key => {
          answers.value[key].type = null;
      }); 
      ws.question(question.value, answers.value);
    }

    function reset_value(){
      Object.keys(answers.value).forEach(key => {
          answers.value[key].value = null;
      }); 
      ws.question(question.value, answers.value);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function grap(next_amount){

      if(question.value !== null){
        if(answers.value.a.type !== 'success' && answers.value.b.type !== 'success' && answers.value.c.type !== 'success' && answers.value.d.type !== 'success' || selected.value === null){
          throw new Error('A question is already loaded, reveal the answer before loading a new question');
        }
      }

      reset_type();
      reset_value();

      const rand = Math.floor(Math.random() * questions[next_amount].length);
      
      const shuffledAnswers = [
          { value: questions[next_amount][rand].correct, type: 'correct' },
          ...questions[next_amount][rand].bad.map(bad => ({ value: bad, type: 'bad' }))
      ]

      shuffle(shuffledAnswers);
      
      question.value = questions[next_amount][rand].text;
      ws.question(question.value, answers.value);

      setTimeout(() => {           
        answers.value.a = shuffledAnswers[0];    
        ws.question(question.value, answers.value);
      }, 3000);

      
      setTimeout(() => {    
        answers.value.b = shuffledAnswers[1];   
        ws.question(question.value, answers.value);
      }, 5000);


      setTimeout(() => {     
        answers.value.c = shuffledAnswers[2];   
        ws.question(question.value, answers.value);
      }, 7000);

      
      setTimeout(() => {     
        answers.value.d = shuffledAnswers[3];   
          
        correct.value = Object.keys(answers.value).find(key => answers.value[key].value === questions[next_amount][rand].correct);

        ws.question(question.value, answers.value);
      }, 9000);

      return true
    }

    function select(tag){
      if(question.value === null){
        throw new Error('No question, start a new party or new question');
      }

      if(tag !== 'a' && tag !== 'b' && tag !== 'c' && tag !== 'd'){
        throw new Error('Invalid tag, must be a, b, c or d');
      }

      // if already selected, unselect   
      reset_type();

      // select the answer
      selected.value = tag;
      answers.value[tag].type = 'selected';

      ws.question(question.value, answers.value);
      return true;
    }

    function reveal(){
      if(question.value === null){
        throw new Error('No question, start a new party or new question');
      }

      if(selected.value === null && abandonned.value === false){
        throw new Error('No answer selected, select an answer before reveal');
      }

      answers.value[correct.value].type = 'success';

      ws.question(question.value, answers.value);
      return true;
    }

    function abandon(){
      abandonned.value = true;
      if(question.value){
        reveal()
      }
      return true;
    }

    return { 
      grap,
      reset_type,
      reset_value,
      abandon,
      reset,
      select,
      question,
      answers,
      correct,
      selected,
      reveal,
      shuffle
    }
})
export default useQuestions;
