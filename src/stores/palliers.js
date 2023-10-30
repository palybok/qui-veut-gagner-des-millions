import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'


export const usePalliers = defineStore('palliers', () => {

    // List of palliers
    const palliers = {
      "0" : [0],
      "1" : [200, 300, 500, 800],
      "2" : [1500, 3000, 6000, 12000, 24000 ],
      "3" : [48000, 72000, 100000, 150000, 300000],
      "4" : [1000000]
    }

    // Actual pallier
    const pallier = ref(0)

    // Actual amount 
    const amount = ref(0)

    function reset(){
      pallier.value = 0
      amount.value = 0
    }

    function win() {
          let current_pallier_amounts = palliers[pallier.value];
          
          // Recherche de l'index du montant actuel
          let index = current_pallier_amounts.indexOf(amount.value);

          // Si le montant actuel n'est pas le dernier montant du pallier
          if(index < current_pallier_amounts.length - 1){
              amount.value = current_pallier_amounts[index + 1];
          } else {
              // Si nous sommes au dernier montant du pallier
              if(pallier.value < Object.keys(palliers).length - 1) {
                  pallier.value += 1;
                  amount.value = palliers[pallier.value][0];
              } else {
                  // Le joueur a atteint le dernier montant. Vous pouvez traiter cela comme vous le souhaitez.
                  // Par exemple, ne rien changer et garder le montant maximal.
                  amount.value = palliers[pallier.value][0];
              }
          }
      }

      function next_amount(){
          let current_pallier_amounts = palliers[pallier.value];
          
          // Recherche de l'index du montant actuel
          let index = current_pallier_amounts.indexOf(amount.value);

          // Si le montant actuel n'est pas le dernier montant du pallier
          if(index < current_pallier_amounts.length - 1){
              return current_pallier_amounts[index + 1];
          } else {
              // Si nous sommes au dernier montant du pallier
              if(pallier.value < Object.keys(palliers).length - 1) {
                  return palliers[pallier.value + 1][0];
              } else {
                  // Le joueur a atteint le dernier montant. Vous pouvez traiter cela comme vous le souhaitez.
                  // Par exemple, retourner le montant maximal.
                  return palliers[pallier.value][0];
              }
          }
      }


    function lose(){
      amount.value = palliers[pallier.value][0];
    }


  
    return { 
      palliers, 
      pallier, 
      amount, 
      reset,
      next_amount,
      win,
      lose
    }
})
export default usePalliers;
