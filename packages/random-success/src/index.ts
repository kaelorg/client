function randomSuccess(reduce = 0) {
  return (
    Math.random() * 100 < Math.min(100, Math.floor(Math.random() * reduce))
  );
}

export default randomSuccess;
