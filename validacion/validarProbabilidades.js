module.exports = function validarProbabilidades(probabilidades) {
  if (Array.isArray(probabilidades)) {
    const suma = probabilidades.reduce((acc, item) => acc + (item.porcentaje || 0), 0);
    if (suma !== 100) {
      return {
        valido: false,
        mensaje: `La suma de los porcentajes debe ser 100%. Actualmente es ${suma}%.`
      };
    }
    return { valido: true };
  }

  if (typeof probabilidades === 'object' && probabilidades !== null) {
    const valores = Object.values(probabilidades);
    const suma = valores.reduce((acc, val) => acc + Number(val || 0), 0);
    if (suma !== 100) {
      return {
        valido: false,
        mensaje: `La suma de los porcentajes debe ser 100%. Actualmente es ${suma}%.`
      };
    }
    return { valido: true };
  }

  return {
    valido: false,
    mensaje: 'Las probabilidades deben ser un arreglo o un objeto'
  };
};
