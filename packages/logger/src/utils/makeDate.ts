function makeDate(): string {
  const brazilianDate = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  return new Date(brazilianDate).toISOString();
}

export default makeDate;
