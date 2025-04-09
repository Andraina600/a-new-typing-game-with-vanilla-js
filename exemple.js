const getCurrentStats = () => {
    acc_err = fn_acc()
    acc_correct = fn_acc()
    acc_NumberChar = fn_acc()
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = acc_err[0] * 100; //(wordsToType[currentWordIndex].length / inputField.value.length) * 100;
    const err = acc_err[1]
    const correct = acc_correct[2]
    const NumberChar = acc_NumberChar[3]
    return { wpm: wpm, accuracy: accuracy, error: err, correct: correct , totale: NumberChar};
    
};

const { wpm, accuracy, error , correct , totale} = getCurrentStats();
            if(wordsToType[currentWordIndex].length != inputField.value.length){
                accum_wpm += 0
            }
            else{
                accum_wpm += wpm   
            }

            const fn_acc = () => {
                let correct = 0
                let err = 0
                let len_val_input = inputField.value.length
                let len_word = wordsToType[currentWordIndex].length
                let sum_totale = 0
            
                if (Math.min([len_val_input, len_word]) === len_val_input) {
                    inputField.value.split("").forEach((letter, index) => {
                        if(wordsToType[currentWordIndex][index] === letter)
                            correct++
                        else
                            err++
                    })
                    sum_totale = correct + err
                }
                else {
                    wordsToType[currentWordIndex].split("").forEach((letter, index) => {
                        if(inputField.value[index] === letter)
                            correct++
                        else
                            err++
                     })
                     sum_totale = correct + err
                }  
                
                return [correct / len_word, err, correct, sum_totale]
            }
   
            const update_minuteur = () => {
                const secd = times % 60
                minuteur.innerHTML = `${secd}s`
                times-- 
                if(times < 0){
                    clearInterval(interval)
                }
            }
            
            const start_minuteur = () => {
                interval = setInterval(update_minuteur, 1000)
            }