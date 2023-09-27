function randomStringGenerator(size) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679";
  const charLength = characters.length;

  let result = "";

  for (let i = 0; i < size; i++) {
    let index = Math.floor(Math.random() * charLength);
    result += characters[index];
  }

  return result;
}

// console.log(randomStringGenerator(10));
export default randomStringGenerator;
