export default function convertHoursToMinutes(time: string) {

    //Convertendo a hora do tipo string em minutos tipo Number
   const [hour, minutes] = time.split(':').map(Number); //No Array, o hour é referente a posição zero, ou seja, hora, e o minutes à posição 1. ex: 8:00 -> [0]=>8; [1]=>00;
   const timeInMinutes = (hour * 60) + minutes; // 8*60 + 00 = 480 min;

   return timeInMinutes;
}