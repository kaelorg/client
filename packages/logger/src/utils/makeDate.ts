function makeDate(): string {
  return new Date(Date.now()).toISOString();
}

export default makeDate;
