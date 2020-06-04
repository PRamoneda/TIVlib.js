function DFT(input, zero = 1e-10) {
  // Discrete Fourier Transform
  const N = input.length;
  const signals = [];
  // Each discrete frecuenciy
  for (let frequency = 0; frequency < N; frequency += 1) {
    //complex(frequencySignal)
    let frequencySignal_re = 0;
    let frequencySignal_im = 0;
    // Each discrete time
    for (let timer = 0; timer < N; timer += 1) {
      const amplitude = input[timer];

      //rotation angle.
      const angle = -1 * (2 * Math.PI) * frequency * (timer / N);

      // Remember that e^ix = cos(x) + i * sin(x);

      let point_re = Math.cos(angle) * amplitude;
      let point_im = Math.sin(angle) * amplitude;
      // Add this data point's contribution.
      frequencySignal_re += point_re;
      frequencySignal_im += point_im;
    }

    // If is close to zero.... zero
    if (Math.abs(frequencySignal_re) < zero) {
      frequencySignal_re = 0;
    }

    if (Math.abs(frequencySignal_im) < zero) {
      frequencySignal_im = 0;
    }

    // Average contribution at this frequency.
    // complex(frecuencySignal) / N
    frequencySignal_re = (frequencySignal_re * N) / (N*N);
    frequencySignal_im = (frequencySignal_im * N) / (N*N);

    // Add current frequency signal to the list of compound signals.
    signals.push(frequencySignal_re);
    signals.push(frequencySignal_im);

  }

  return signals;
}

function division(vector, energy){
  for (var i = vector.length - 1; i >= 0; i--) {
    vector[i] = vector[i]/energy;
  }
  return vector;
}

function multiply(vectorA, vectorB){
    var ans = new Array(12);
    for (var i = vectorA.length - 1; i >= 0; i--) {
        ans[i] = vectorA[i] * vectorB[i]
    }
    return ans;
}

function TIV(pcp, weights){
  // Tonal Interval Vectors
  let fft = DFT(pcp);
  let energy = fft[0]; 
  let vector = fft.slice(2, 14);
  if (weights === "symbolic"){
      let weights_symbolic = [2, 2, 11, 11, 17, 17, 16, 16, 19, 19, 7, 7] 
      vector = multiply(division(vector, energy), weights_symbolic);
  }
  else if (weights === "audio"){
      let weights_audio = [3, 3, 8, 8, 11.5, 11.5, 15, 15, 14.5, 14.5, 7.5,7.5];
      vector = multiply(division(vector, energy), weights_audio);
  }
  else if (weights === "harte"){
      let weithts_harte = [0, 0, 0, 0, 1, 1, 0.5, 0.5, 1, 1, 0, 0];
      vector = multiply(division(vector, energy), weithts_harte);
  }
  return vector;
}

function tonal_interval_space(chroma, weights="audio"){
  // Tonal Interval Space
  let centroid_vector = [];
  for (var i = 0; i < chroma.length; i++){
    let each_chroma = chroma[i];
    
    let centroid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (!everything_is_zero(each_chroma)){
        centroid = TIV(each_chroma, weights)  
    }
    centroid_vector.push(centroid);
    
  }
  return centroid_vector;
}