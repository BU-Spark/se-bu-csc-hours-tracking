const convertToBase64 = (buffer: any): string => {
  //should be type EventImage but it will error
  const uint8Array = new Uint8Array(buffer.data);
  const binaryString = uint8Array.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  return btoa(binaryString);
};

export default convertToBase64;
