import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTuya } from '@/stores/tuya'
import { useConfig } from '@/stores/config'

export const useLights = defineStore('lights', () => {

    // Tuya
    const tuya = useTuya()

    // Config
    const config = useConfig()

    const light_1 = config.light_1
    const light_2 = config.light_2
    const light_3 = config.light_3
    const light_4 = config.light_4

    function start(){
      tuya.device_turn_on(light_4)
      tuya.device_brightness(light_4, 255)
      tuya.device_color(light_4, {
        "hue": 50,
        "saturation": .1
      })
      tuya.device_turn_on(light_3)
      tuya.device_brightness(light_3, 255)
      tuya.device_color(light_3, {
        "hue": 50,
        "saturation": .1
      })
    }

    function new_question(){
      tuya.device_turn_on(light_4)
      tuya.device_brightness(light_4, 255)
      tuya.device_color(light_4, {
        "hue": 180,
        "saturation": 1
      })
      tuya.device_turn_on(light_3)
      tuya.device_brightness(light_3, 255)
      tuya.device_color(light_3, {
        "hue": 180,
        "saturation": 1
      })
    }

    function win(){
      tuya.device_turn_on(light_4)
      tuya.device_brightness(light_4, 255)
      tuya.device_color(light_4, {
        "hue": 120,
        "saturation": 1
      })
    }
    
    
    function selected(){
      tuya.device_turn_on(light_4)
      tuya.device_brightness(light_4, 255)
      tuya.device_color(light_4, {
        "hue": 240,
        "saturation": 1
      })
    }

    function lose() {
      tuya.device_brightness(light_4, 255);
      tuya.device_color(light_4, {
          "hue": 0,      // Red
          "saturation": 1
      });
      setTimeout(() => {
          blinkLight(light_4, 3, 400); 
      }, 1000);
      
      tuya.device_brightness(light_1, 60);
      tuya.device_color(light_1, {
          "hue": 10,
          "saturation": 0.8
      });

      tuya.device_brightness(light_2, 60);
      tuya.device_color(light_2, {
          "hue": 350, 
          "saturation": 0.8
      });

      tuya.device_brightness(light_3, 255);
      tuya.device_color(light_3, {
          "hue": 0,      // Red
          "saturation": 1
      });
      setTimeout(() => {
          tuya.device_brightness(light_3, 50); 
      }, 1500);
  }

    function blinkLight(device, count, delay) {
        if (count <= 0) return;

        tuya.device_turn_off(device);
        setTimeout(() => {
            tuya.device_turn_on(device);
            setTimeout(() => {
              blinkLight(device, count - 1, delay); 
            }, delay);
        }, delay);
    }

    function new_pallier() {
      
        tuya.device_brightness(light_4, 255);
        tuya.device_color(light_4, {
            "hue": 0,
            "saturation": 1  
        });
        blinkLight(light_4, 5, 300); 

        setTimeout(() => {
            tuya.device_color(light_4, {
                "hue": 270,
                "saturation": 1 
            });
        }, 2500);  

        tuya.device_brightness(light_1, 40);
        tuya.device_color(light_1, {
            "hue": 40,
            "saturation": 0.7  
        });
        
        tuya.device_brightness(light_2, 100);
        tuya.device_color(light_2, {
            "hue": 90,  
            "saturation": 0.7 
        });

        tuya.device_brightness(light_3, 100);
        tuya.device_color(light_3, {
            "hue": 60,  
            "saturation": 1  
        });
        setTimeout(() => {
            tuya.device_color(light_3, {
                "hue": 240, 
                "saturation": 0.8
            });
        }, 5000);
    }


    return { 
        start,
        new_question,
        win,
        lose,
        selected,
        new_pallier
    }
},
  {
    persist: true,
  },
)
export default useLights;
