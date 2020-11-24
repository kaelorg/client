function makeDate(): string {
  const brazilianDate = new Date().toLocaleString('pt-BR');

  return new Date(brazilianDate).toISOString();
}

export default makeDate;
