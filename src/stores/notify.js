import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useNotification } from "@kyvg/vue3-notification"

export const useNotifyService = defineStore('notify', () => {
  const notification = useNotification()

  const error_code = ref(0);
  const error_message = ref('');
  const success_message = ref('');

  function set_error(message, code = null) {
    error_code.value = code;
    error_message.value = message;

    if(code === null)
      notification.notify({
        text: message,
        type: "error",
        duration: 5000,
      });
    else
      notification.notify({
        title: "Erreur",
        text: code + ': ' + message,
        type: "error",
        duration: 5000,
      });
  }

  function set_success(message) {
    success_message.value = message;

    console.log(message);

    notification.notify({
      title: "Parfait !",
      text: message,
      type: "success",
      duration: 5000,
    });
  }


  return {
    error_code,
    error_message,
    success_message,
    set_error,
    set_success,
  };
});
